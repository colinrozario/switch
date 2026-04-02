import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, ChevronDown, ChevronUp, Clock, Target, Shield } from 'lucide-react';
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
    }, [profileId]);

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
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>Analyzing viable transitions...</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Modeling feasibility based on your constraints.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Viable Paths</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        We found {pathSet?.paths?.length || 0} paths that respect your financial and time constraints.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
                    {pathSet?.paths?.map((path, index) => (
                        <PathCard 
                            key={index} 
                            path={path} 
                            onSelect={() => handleSelect(path.target_role_id)}
                        />
                    ))}
                </div>

                {pathSet?.rejected_paths?.length > 0 && (
                    <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                        <button 
                            onClick={() => setShowRejected(!showRejected)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', margin: '0 auto' }}
                        >
                            {showRejected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            {showRejected ? "Hide" : "Show"} {pathSet.rejected_paths.length} Rejected Paths
                        </button>
                        
                        <AnimatePresence>
                            {showRejected && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                                        {pathSet.rejected_paths.map((r, i) => (
                                            <div key={i} style={rejectedCardStyle}>
                                                <h4 style={{ color: '#fff', marginBottom: '8px' }}>{r.target_role_id.replace(/_/g, ' ')}</h4>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{r.rejection_reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const PathCard = ({ path, onSelect }) => (
    <Card className="path-card">
        <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', textTransform: 'capitalize' }}>
            {path.target_role_id.replace(/_/g, ' ')}
        </h3>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
            <div style={statStyle}>
                <Clock size={14} />
                <span>~{path.estimated_transition_months} Months</span>
            </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
            <h4 style={sectionTitleStyle}><Target size={14} /> Why this fits</h4>
            <p style={reasoningStyle}>{path.feasibility_reasoning}</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
            <h4 style={sectionTitleStyle}><TriangleAlert size={14} /> Primary Risks</h4>
            <ul style={listStyle}>
                {path.key_risks?.map((risk, i) => <li key={i}>{risk}</li>)}
            </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
            <h4 style={sectionTitleStyle}><Shield size={14} /> Skill Gaps</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {path.skill_gaps?.map((gap, i) => (
                    <span key={i} style={gapBadgeStyle}>{gap}</span>
                ))}
            </div>
        </div>

        <Button onClick={onSelect} style={{ width: '100%' }}>
            Select This Path →
        </Button>
    </Card>
);

const statStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-primary)',
    fontSize: '0.9rem',
    fontWeight: '600'
};

const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const reasoningStyle = {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#fff'
};

const listStyle = {
    paddingLeft: '18px',
    color: '#ffaaaa', // Light red for risk
    fontSize: '0.95rem',
    lineHeight: '1.6'
};

const gapBadgeStyle = {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)'
};

const rejectedCardStyle = {
    padding: '24px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px'
};

export default OptionsPage;
