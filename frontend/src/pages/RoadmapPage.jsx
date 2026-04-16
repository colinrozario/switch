import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    RefreshCcw, 
    ArrowRight, 
    AlertTriangle,
    Flag,
    Wind,
    Loader2,
    XCircle
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
    const [error, setError] = useState(null);

    const params = new URLSearchParams(location.search);
    const queryBridgeId = params.get('id') || bridgeId;
    const horizon = params.get('horizon') || 9;

    useEffect(() => {
        if (!queryBridgeId) {
            navigate('/diagnosis');
            return;
        }

        const fetchRoadmap = async () => {
            try {
                const roadmapData = await endpoints.getRoadmap(queryBridgeId, horizon);
                setRoadmap(roadmapData);
            } catch (err) {
                console.error("Failed to fetch roadmap", err);
                setError("We couldn't build your roadmap. Please go back and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [queryBridgeId, horizon, navigate]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Building your {horizon}-month plan...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', gap: '16px' }}>
                <XCircle size={48} style={{ color: '#EF4444' }} />
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{error}</h2>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    // roadmap.phases is the full JSON blob stored by the backend
    // It has shape: { phases: [...], opening_warning: "...", go_no_go_signal: "...", total_months, horizon_months }
    const phasesBlob = roadmap?.phases || {};
    const phases = phasesBlob.phases || [];
    const opening_warning = phasesBlob.opening_warning;
    const go_no_go_signal = phasesBlob.go_no_go_signal;
    const totalMonths = phasesBlob.total_months || roadmap?.timeline_months || horizon;

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
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
                            YOUR ACTION PLAN
                        </div>
                        <h1 style={{ fontSize: '48px', letterSpacing: '-0.03em', marginBottom: '16px' }}>Your Step-by-Step Guide</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.5 }}>
                            A {totalMonths}-month plan built specifically around your savings, schedule, and target role.
                        </p>
                    </div>

                    {/* 1. STACKED WARNINGS & CONSTRAINTS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '80px' }}>
                        {opening_warning && (
                            <div style={{ 
                                background: '#FFFBEB', 
                                border: '1px solid #F59E0B', 
                                borderRadius: '16px', 
                                padding: '32px',
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'flex-start'
                            }}>
                                <AlertTriangle size={24} style={{ color: '#D97706', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#B45309', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>RISK ASSESSMENT</div>
                                    <div style={{ fontSize: '17px', color: '#92400E', lineHeight: 1.5, fontWeight: '600' }}>{opening_warning}</div>
                                </div>
                            </div>
                        )}
                        {go_no_go_signal && (
                            <div style={{ 
                                background: '#FFFFFF', 
                                border: '2px solid #EF4444', 
                                borderRadius: '16px', 
                                padding: '32px',
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'flex-start'
                            }}>
                                <ShieldAlert size={24} style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#B91C1C', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>GO / NO-GO SIGNAL</div>
                                    <div style={{ fontSize: '17px', color: '#B91C1C', lineHeight: 1.5, fontWeight: '700' }}>{go_no_go_signal}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        <div style={{ position: 'absolute', left: '28px', top: '40px', bottom: '40px', width: '2px', background: 'var(--color-border)', zIndex: 0 }} />
                        
                        {phases.map((phase, index) => {
                            // Milestones can be strings or {name, description} objects
                            const milestoneList = (phase.milestones || []).map(m => 
                                typeof m === 'string' ? m : m.name || m.description || String(m)
                            );

                            return (
                                <div key={index} style={{ position: 'relative', zIndex: 1, paddingLeft: '80px' }}>
                                    {/* Phase Connector Dot */}
                                    <div style={{ 
                                        position: 'absolute', 
                                        left: '18px', 
                                        top: '28px', 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%', 
                                        background: '#FFFFFF', 
                                        border: '4px solid var(--color-accent)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }} />

                                    <Card padding="40px" style={{ background: '#FFFFFF' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                                    Step {index + 1}
                                                </div>
                                                <h3 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px' }}>{phase.name}</h3>
                                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                                                        <Clock size={16} />
                                                        {/* Support both duration_months (new) and duration_weeks (legacy) */}
                                                        {phase.duration_months
                                                            ? `${phase.duration_months} month${phase.duration_months > 1 ? 's' : ''}`
                                                            : `${Math.ceil(phase.duration_weeks / 4.33)} months`}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                                                        <Wind size={16} />
                                                        {phase.weekly_effort_hours || phase.weekly_hours_required || '—'}h / Week
                                                    </div>
                                                </div>
                                            </div>
                                            {phase.goal && (
                                                <div style={{ textAlign: 'right', background: 'var(--color-surface)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', flexShrink: 0, maxWidth: '240px' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>PHASE GOAL</div>
                                                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>{phase.goal || phase.objective}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Financial Context */}
                                        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', padding: '16px 20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                                                Estimated capital required for this phase:
                                                <span style={{ color: 'var(--color-text)', marginLeft: '8px' }}>
                                                    ₹{Math.round((phase.duration_months || Math.ceil((phase.duration_weeks || 4) / 4.33)) * 45000).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
                                            {/* Milestones */}
                                            <div>
                                                <div style={sectionTagStyle}><Flag size={14} /> Execution Checklist</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {milestoneList.map((m, i) => (
                                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                            <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #E2E8F0', background: '#F8FAFC', flexShrink: 0, marginTop: '2px' }} />
                                                            <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text)' }}>{m}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Failure & Fallback as first-class content */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                {phase.failure_trigger && (
                                                    <div style={{ padding: '24px', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FEE2E2' }}>
                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#B91C1C', marginBottom: '12px' }}>
                                                            <AlertCircle size={18} />
                                                            <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failure Trigger</div>
                                                        </div>
                                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#991B1B', lineHeight: 1.5 }}>
                                                            {phase.failure_trigger}
                                                        </div>
                                                    </div>
                                                )}
                                                {phase.fallback_action && (
                                                    <div style={{ padding: '24px', background: '#FFFBEB', borderRadius: '16px', border: '1px solid #FEF3C7' }}>
                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#B45309', marginBottom: '12px' }}>
                                                            <RefreshCcw size={18} />
                                                            <div style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fallback Action</div>
                                                        </div>
                                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#92400E', lineHeight: 1.5 }}>
                                                            {phase.fallback_action}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation to Simulator */}
                    <Card padding="48px" style={{ 
                        marginTop: '80px', 
                        background: '#0F172A', 
                        color: '#FFFFFF',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px', color: '#FFFFFF' }}>Try a Scenario</h3>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', fontWeight: '500' }}>
                            Change your savings or work hours to see how it affects your plan in real-time.
                        </p>
                        <Button 
                            size="lg" 
                            onClick={() => navigate(`/simulator?id=${roadmap.id}`)}
                            style={{ width: '100%', maxWidth: '320px' }}
                        >
                            Practice Your Plan <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                        </Button>
                    </Card>

                    {/* Disclaimer */}
                    <div style={{ marginTop: '80px', textAlign: 'center', padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                            <strong>Just a heads up:</strong> These steps are targets to hit, but they don't guarantee a job. 
                            Switch helps you decide what's best, but remember that every career change has some risk.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const sectionTagStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '16px'
};

export default RoadmapPage;
