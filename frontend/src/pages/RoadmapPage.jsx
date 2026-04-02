import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ShieldAlert, 
    CheckCircle2, 
    Clock, 
    Target, 
    AlertCircle, 
    RefreshCcw, 
    ArrowRight, 
    CheckCircle 
} from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const RoadmapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bridgeId } = useStore();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(location.search);
    const queryBridgeId = params.get('id') || bridgeId;

    useEffect(() => {
        if (!queryBridgeId) {
            navigate('/diagnosis');
            return;
        }

        const fetchRoadmap = async () => {
            try {
                const response = await endpoints.getRoadmap(queryBridgeId);
                setRoadmap(response.data);
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [queryBridgeId]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>Generating phased roadmap...</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Mapping specific milestones and failure triggers.</p>
            </div>
        );
    }

    const { phases, opening_warning, go_no_go_signal } = roadmap.phases;

    return (
        <div style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ marginBottom: '64px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Master Roadmap</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
                        A conservative, {roadmap.timeline_months}-month plan to transition safely.
                    </p>
                </div>

                {/* Opening Warning & Go/No-Go */}
                <div style={{ display: 'grid', gap: '24px', marginBottom: '64px' }}>
                    {opening_warning && (
                        <div style={warningBoxStyle}>
                            <ShieldAlert size={20} style={{ marginTop: '2px' }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Primary Risk Warning</strong>
                                {opening_warning}
                            </div>
                        </div>
                    )}
                    {go_no_go_signal && (
                        <div style={goNoGoBoxStyle}>
                            <AlertCircle size={20} style={{ marginTop: '2px' }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>ABORT SIGNAL — STOP IF THIS HAPPENS</strong>
                                {go_no_go_signal}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phases */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {phases.map((phase, index) => (
                        <PhaseCard key={index} phase={phase} index={index} />
                    ))}
                </div>

                {/* Step 6 CTA: Simulator */}
                <Card style={{ marginTop: '80px', textAlign: 'center', padding: '48px' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Explore "What-If" Scenarios</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                        Adjust your savings, weekly hours, or timeline to see how your transition risk changes.
                    </p>
                    <Button onClick={() => navigate(`/simulator?id=${roadmap.id}`)}>
                        Enter Simulator <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                    </Button>
                </Card>

                {/* Mandatory Disclaimer (Rule FE-03) */}
                <p style={{ marginTop: '64px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    <strong>Disclaimer:</strong> Roadmap milestones are estimated durational targets. 
                    Meeting a milestone does not guarantee job placement or financial outcome.
                </p>
            </motion.div>
        </div>
    );
};

const PhaseCard = ({ phase, index }) => (
    <Card style={{ position: 'relative' }}>
        <div style={phaseNumberStyle}>Phase {index + 1}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingRight: '100px' }}>
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{phase.name}</h3>
                <div style={{ display: 'flex', gap: '24px', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {phase.duration_months} Months</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCcw size={14} /> {phase.weekly_effort_hours} Hrs / Wk</span>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={sectionLabelStyle}>GOAL</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{phase.goal}</div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Milestones */}
            <div>
                <div style={sectionLabelStyle}>MILESTONES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {phase.milestones.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)' }}>
                            <CheckCircle size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                            <span>{m}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safeguards (Non-optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <div style={{ ...sectionLabelStyle, color: '#ff4444' }}>FAILURE TRIGGER</div>
                    <div style={{ fontSize: '0.95rem', color: '#ffaaaa', borderLeft: '2px solid #ff4444', paddingLeft: '16px' }}>
                        {phase.failure_trigger}
                    </div>
                </div>
                <div>
                    <div style={{ ...sectionLabelStyle, color: '#ffbb33' }}>FALLBACK ACTION</div>
                    <div style={{ fontSize: '0.95rem', color: '#ffecb3', borderLeft: '2px solid #ffbb33', paddingLeft: '16px' }}>
                        {phase.fallback_action}
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

const warningBoxStyle = {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    backgroundColor: 'rgba(255, 187, 51, 0.1)',
    border: '1px solid rgba(255, 187, 51, 0.3)',
    borderRadius: '16px',
    color: '#ffbb33',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    textAlign: 'left'
};

const goNoGoBoxStyle = {
    ...warningBoxStyle,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    color: '#ffaaaa'
};

const sectionLabelStyle = {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: 'var(--color-text-secondary)',
    marginBottom: '12px'
};

const phaseNumberStyle = {
    position: 'absolute',
    top: '40px',
    right: '40px',
    fontSize: '4rem',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.03)',
    lineHeight: 1,
    pointerEvents: 'none'
};

export default RoadmapPage;
