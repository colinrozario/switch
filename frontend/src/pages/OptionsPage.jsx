import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, ChevronDown, ChevronUp, Clock, Target, Shield, ArrowRight, Briefcase, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const OptionsPage = () => {
    const navigate = useNavigate();
    const { profileId, setPathSetId } = useStore();
    const [pathSet, setPathSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRejected, setShowRejected] = useState(false);

    useEffect(() => {
        if (!profileId) {
            navigate('/diagnosis');
            return;
        }

        const fetchPaths = async () => {
            try {
                // axios client interceptor returns data directly
                const pathSetData = await endpoints.getCareerPaths(profileId);
                setPathSet(pathSetData);
                setPathSetId(pathSetData.id);
            } catch (error) {
                console.error("Failed to fetch paths", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaths();
    }, [profileId, navigate, setPathSetId]);

    const handleSelect = async (pathId) => {
        try {
            await endpoints.selectCareerPath(pathSet.id, pathId);
            navigate(`/bridge?id=${pathSet.id}`);
        } catch (error) {
            console.error("Failed to select path", error);
            alert("Couldn't select that path — please try again.");
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    style={{ marginBottom: '32px', color: 'var(--color-accent)' }}
                >
                    <Briefcase size={48} />
                </motion.div>
                <h2 style={{ fontSize: '24px', letterSpacing: '-0.02em', marginBottom: '12px' }}>Finding Your Best Options</h2>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
                    We're checking thousands of possibilities to find the safest paths for your career change.
                </p>
                <div style={{ marginTop: '32px', width: '200px', height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ height: '100%', background: 'var(--color-accent)' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: '#FFFFFF', 
                        padding: '4px 12px', 
                        borderRadius: '99px',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '12px',
                        fontWeight: '700',
                        marginBottom: '24px'
                    }}>
                        CAREER OPTIONS FOUND
                    </div>
                    <h1 style={{ fontSize: '48px', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                        Select Your Next Path
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                        We've found {pathSet?.paths?.length || 0} paths that match your skills and protect your savings.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {pathSet?.paths?.slice(0, 3).map((path, index) => (
                        <PathCard 
                            key={index} 
                            path={path} 
                            onSelect={() => handleSelect(path.target_role_id)}
                        />
                    ))}
                </div>

                {pathSet?.rejected_paths?.length > 0 && (
                    <div style={{ marginTop: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ height: '1px', flex: 1, background: 'var(--color-border)' }} />
                            <button 
                                onClick={() => setShowRejected(!showRejected)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    color: 'var(--color-text-secondary)', 
                                    fontSize: '14px', 
                                    fontWeight: '700',
                                    background: '#FFFFFF', 
                                    border: '1px solid var(--color-border)', 
                                    padding: '8px 20px',
                                    borderRadius: '99px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {showRejected ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {showRejected ? "Hide" : "See Why Other Paths Didn't Make It"} ({pathSet.rejected_paths.length})
                            </button>
                            <div style={{ height: '1px', flex: 1, background: 'var(--color-border)' }} />
                        </div>
                        
                        <AnimatePresence>
                            {showRejected && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                                        {pathSet.rejected_paths.map((r, i) => (
                                            <Card key={i} padding="24px" style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', opacity: 0.8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                    <div style={{ padding: '6px', background: '#F1F5F9', borderRadius: '6px', color: 'var(--color-text-secondary)' }}>
                                                        <AlertCircle size={16} />
                                                    </div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: '800' }}>
                                                        {r.target_role_label || r.target_role_id.replace(/_/g, ' ')}
                                                    </h4>
                                                </div>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6, fontWeight: '500' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-text)' }}>REASON: </span>
                                                    {r.rejection_reason}
                                                </p>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

const PathCard = ({ path, onSelect }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card padding="32px" style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', letterSpacing: '-0.02em', fontWeight: '900', color: 'var(--color-text)', marginBottom: '8px' }}>
                        {path.target_role_label || path.target_role_id.replace(/_/g, ' ')}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MatchBadge level={path.match_level} />
                        <div style={{ 
                            fontSize: '13px', 
                            fontWeight: '800', 
                            color: 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Target size={14} /> {path.match_percentage}% Match
                        </div>
                    </div>
                </div>
                <div style={{ 
                    padding: '4px 10px', 
                    background: 'var(--color-surface)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '11px',
                    fontWeight: '900'
                }}>
                    <Clock size={12} />
                    {path.estimated_transition_months}MO
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-text)', fontWeight: '600' }}>
                    {path.feasibility_summary}
                </p>
            </div>

            <button 
                onClick={() => setExpanded(!expanded)}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: 'var(--color-accent)', 
                    fontSize: '13px', 
                    fontWeight: '800', 
                    cursor: 'pointer',
                    marginBottom: '24px'
                }}
            >
                {expanded ? 'Fewer Details' : 'Full Reasoning'}
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ marginBottom: '32px', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.7, fontWeight: '500' }}>
                            {path.feasibility_details}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', paddingBottom: '24px' }}>
                            <div>
                                <div style={labelStyle}><TriangleAlert size={14} /> Risk Level: <span style={{ color: path.match_level === 'strong' ? '#059669' : path.match_level === 'moderate' ? '#D97706' : '#DC2626', marginLeft: '4px' }}>{path.match_level?.toUpperCase() || 'STRETCH'}</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {path.key_risks?.map((risk, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                            <span>•</span> {risk}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={labelStyle}><Shield size={14} /> Critical Gaps</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {path.skill_gaps?.map((gap, i) => (
                                        <span key={i} style={{
                                            padding: '4px 12px',
                                            background: '#F8FAFC',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            color: 'var(--color-text-secondary)'
                                        }}>{gap}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: 'auto' }}>
                <Button onClick={onSelect} style={{ width: '100%' }}>
                    Select This Path <ArrowRight size={16} />
                </Button>
            </div>
        </Card>
    );
};

const MatchBadge = ({ level }) => {
    const config = {
        strong: { label: 'High Fit', color: '#059669', bg: '#ECFDF5', border: '#10B98133' },
        moderate: { label: 'Moderate', color: '#D97706', bg: '#FFFBEB', border: '#F59E0B33' },
        stretch: { label: 'Stretch', color: '#DC2626', bg: '#FEF2F2', border: '#EF444433' }
    };

    const { label, color, bg, border } = config[level] || config.stretch;

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 10px',
            borderRadius: '99px',
            background: bg,
            color: color,
            border: `1px solid ${border}`,
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
        }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
            {label}
        </div>
    );
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
};

export default OptionsPage;
