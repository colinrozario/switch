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
                const response = await endpoints.getCareerPaths(profileId);
                setPathSet(response.data);
                setPathSetId(response.data.id);
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
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    style={{ marginBottom: '32px', color: 'var(--color-primary)' }}
                >
                    <Briefcase size={48} />
                </motion.div>
                <h2 style={{ fontSize: '24px', letterSpacing: '-0.02em', marginBottom: '12px' }}>Synthesizing Viable Paths</h2>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
                    Our engine is filtering 100k+ permutations against your constraints to find paths with the highest safety margin.
                </p>
                <div style={{ marginTop: '32px', width: '200px', height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ height: '100%', background: 'var(--color-primary)' }}
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
                        SYSTEM OUTPUT: FEASIBILITY ENGINE
                    </div>
                    <h1 style={{ fontSize: '48px', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                        Calculated Transitions
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                        We found {pathSet?.paths?.length || 0} pathways that preserve your liquid runway while maximizing long-term ROI.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                    {pathSet?.paths?.map((path, index) => (
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
                                    fontWeight: '600',
                                    background: '#FFFFFF', 
                                    border: '1px solid var(--color-border)', 
                                    padding: '8px 16px',
                                    borderRadius: '99px',
                                    cursor: 'pointer' 
                                }}
                            >
                                {showRejected ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {showRejected ? "Hide" : "Show"} Negative Results ({pathSet.rejected_paths.length})
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
                                            <Card key={i} padding="24px" style={{ background: '#FFFFFF', opacity: 0.7 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                    <div style={{ padding: '6px', background: '#FEF2F2', borderRadius: '6px', color: '#DC2626' }}>
                                                        <AlertCircle size={16} />
                                                    </div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'capitalize' }}>
                                                        {r.target_role_id.replace(/_/g, ' ')}
                                                    </h4>
                                                </div>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                                                    Reason: {r.rejection_reason}
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

const PathCard = ({ path, onSelect }) => (
    <Card padding="32px" style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', letterSpacing: '-0.02em', textTransform: 'capitalize', fontWeight: '700', flex: 1 }}>
                {path.target_role_id.replace(/_/g, ' ')}
            </h3>
            <div style={{ 
                padding: '6px 12px', 
                background: 'var(--color-surface)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: 'var(--color-primary)',
                fontSize: '13px',
                fontWeight: '700'
            }}>
                <Clock size={14} />
                {path.estimated_transition_months}m
            </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
            <div style={labelStyle}><Target size={14} /> Strategic Rationale</div>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-text)' }}>
                {path.feasibility_reasoning}
            </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
            <div style={labelStyle}><TriangleAlert size={14} /> Primary Friction Points</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {path.key_risks?.map((risk, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: 'var(--color-accent)' }}>•</span>
                        {risk}
                    </div>
                ))}
            </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
            <div style={labelStyle}><Shield size={14} /> Bridge Requirements</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {path.skill_gaps?.map((gap, i) => (
                    <span key={i} style={{
                        padding: '6px 12px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--color-text-secondary)'
                    }}>{gap}</span>
                ))}
            </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
            <Button onClick={onSelect} style={{ width: '100%' }} size="lg">
                Engage This Track <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
        </div>
    </Card>
);

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
};

export default OptionsPage;
