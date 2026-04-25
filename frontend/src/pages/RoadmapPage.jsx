import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldAlert, AlertTriangle, Loader2, XCircle,
    ArrowRight, IndianRupee, Calendar, Zap,
    BookOpen, Code2, Map, ChevronRight,
} from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Button from '../components/UI/Button';
import RoadmapNode from '../components/UI/RoadmapNode';

/* ─── Summary sidebar stat ─── */
const SidebarStat = ({ label, value, sub, accent }) => (
    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {label}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '900', color: accent || '#FFFFFF', lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500', marginTop: '2px' }}>{sub}</div>}
    </div>
);

/* ─── Phase progress dot in sidebar ─── */
const PHASE_ACCENT = ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24'];

const RoadmapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bridgeId } = useStore();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePhase, setActivePhase] = useState(0);
    const phaseRefs = useRef([]);

    const params = new URLSearchParams(location.search);
    const queryBridgeId = params.get('id') || bridgeId;
    const horizon = parseInt(params.get('horizon') || '9', 10);

    useEffect(() => {
        if (!queryBridgeId) { navigate('/diagnosis'); return; }
        const fetchRoadmap = async () => {
            try {
                const data = await endpoints.getRoadmap(queryBridgeId, horizon);
                setRoadmap(data);
            } catch (err) {
                console.error('Failed to fetch roadmap', err);
                setError("We couldn't build your roadmap. Please go back and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [queryBridgeId, horizon, navigate]);

    // Scroll-spy for sidebar active phase
    useEffect(() => {
        const handler = () => {
            let closest = 0;
            phaseRefs.current.forEach((ref, i) => {
                if (ref && ref.getBoundingClientRect().top <= 200) closest = i;
            });
            setActivePhase(closest);
        };
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, [roadmap]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                    <Loader2 size={40} style={{ color: '#2563EB' }} />
                </motion.div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginTop: '24px' }}>
                    Building your {horizon}-month roadmap...
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                    Our AI is generating your personalised career plan.
                </p>
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

    const blob = roadmap?.phases || {};
    const phases = blob.phases || [];
    const openingWarning = blob.opening_warning;
    const goNoGo = blob.go_no_go_signal;
    const totalMonths = blob.total_months || roadmap?.timeline_months || horizon;

    // Compute summary stats
    const totalCoursesBudget = phases.reduce((acc, p) => acc + (p.estimated_cost_inr || 0), 0);
    const totalWeeks = phases.reduce((acc, p) => acc + (p.duration_weeks || 0), 0);
    const totalSkills = phases.reduce((acc, p) => acc + (p.skills?.length || 0), 0);
    const totalProjects = phases.reduce((acc, p) => acc + (p.projects?.length || 0), 0);
    const totalCourses = phases.reduce((acc, p) => acc + (p.courses?.length || 0), 0);
    const isGoSignal = goNoGo && goNoGo.startsWith('✅');

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

            {/* ── Top Hero Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                paddingTop: '100px', paddingBottom: '64px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Map size={16} style={{ color: '#2563EB' }} />
                            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#60A5FA' }}>
                                Your Career Roadmap
                            </span>
                        </div>
                        <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>
                            {totalMonths}-Month Action Plan
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', fontWeight: '500', maxWidth: '640px', lineHeight: 1.6, marginBottom: '40px' }}>
                            A deterministic, week-by-week plan built from your exact profile, savings, and target role.
                        </p>

                        {/* Stat pills */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {[
                                { icon: Calendar, label: `${totalWeeks} Weeks` },
                                { icon: Zap, label: `${totalSkills} Skills` },
                                { icon: Code2, label: `${totalProjects} Projects` },
                                { icon: BookOpen, label: `${totalCourses} Courses` },
                                { icon: IndianRupee, label: `₹${totalCoursesBudget.toLocaleString('en-IN')} Budget` },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '99px', padding: '8px 16px',
                                }}>
                                    <Icon size={14} style={{ color: '#60A5FA' }} />
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px', alignItems: 'start' }}>

                {/* ── LEFT STICKY SIDEBAR ── */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    {/* Go / No-Go signal */}
                    <div style={{
                        background: isGoSignal ? '#ECFDF5' : '#FEF2F2',
                        border: `1px solid ${isGoSignal ? '#A7F3D0' : '#FEE2E2'}`,
                        borderRadius: '16px', padding: '20px', marginBottom: '24px',
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <ShieldAlert size={20} style={{ color: isGoSignal ? '#059669' : '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: isGoSignal ? '#065F46' : '#991B1B', marginBottom: '6px' }}>
                                    Go / No-Go
                                </div>
                                <p style={{ fontSize: '13px', fontWeight: '600', color: isGoSignal ? '#065F46' : '#991B1B', lineHeight: 1.5, margin: 0 }}>
                                    {goNoGo}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dark stats sidebar */}
                    <div style={{ background: '#0F172A', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                            Plan Summary
                        </div>
                        <SidebarStat label="Total Duration" value={`${totalMonths} Months`} sub={`${totalWeeks} weeks`} />
                        <SidebarStat label="Course Budget" value={`₹${totalCoursesBudget.toLocaleString('en-IN')}`} sub="courses & certifications" accent="#34D399" />
                        <SidebarStat label="Skills to Master" value={totalSkills} sub={`across ${phases.length} phases`} />
                        <SidebarStat label="Projects to Build" value={totalProjects} sub="portfolio-grade" accent="#A78BFA" />
                    </div>

                    {/* Phase navigator */}
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                            Phases
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {phases.map((phase, i) => (
                                <button
                                    key={i}
                                    onClick={() => phaseRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                        background: activePhase === i ? '#EFF6FF' : 'transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{
                                        width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                                        background: PHASE_ACCENT[i % PHASE_ACCENT.length],
                                    }} />
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: activePhase === i ? '#2563EB' : '#475569', lineHeight: 1.3 }}>
                                            {phase.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>
                                            {phase.duration_weeks}w · {phase.weekly_hours}h/wk
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT ── */}
                <div>
                    {/* Risk warning */}
                    {openingWarning && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: '#FFFBEB', border: '1px solid #F59E0B',
                                borderRadius: '16px', padding: '20px 24px',
                                display: 'flex', gap: '16px', alignItems: 'flex-start',
                                marginBottom: '40px',
                            }}
                        >
                            <AlertTriangle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B45309', marginBottom: '6px' }}>
                                    Risk Assessment
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', lineHeight: 1.5, margin: 0 }}>
                                    {openingWarning}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase nodes */}
                    <div>
                        {phases.length > 0 ? phases.map((phase, i) => (
                            <div key={i} ref={el => phaseRefs.current[i] = el} style={{ scrollMarginTop: '100px' }}>
                                <RoadmapNode
                                    phase={phase}
                                    phaseIndex={i}
                                    isLast={i === phases.length - 1}
                                />
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                                <Map size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
                                <p style={{ fontWeight: '600' }}>No phase data found. Try regenerating your roadmap.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Try Simulator CTA ── */}
                    <div style={{
                        marginTop: '64px',
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        borderRadius: '24px', padding: '48px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#60A5FA', marginBottom: '16px' }}>
                            What If Simulator
                        </div>
                        <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                            Change Your Variables
                        </h3>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: '500', maxWidth: '480px', lineHeight: 1.6, marginBottom: '32px' }}>
                            See how adjusting your savings, work hours, or timeline affects your plan in real time.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate(`/simulator?id=${roadmap.id}`)}
                            style={{ background: '#2563EB', color: '#FFFFFF', height: '52px', padding: '0 32px', fontSize: '16px', fontWeight: '800', borderRadius: '14px' }}
                        >
                            Open Simulator <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                        </Button>
                    </div>

                    {/* Disclaimer */}
                    <div style={{ marginTop: '48px', padding: '24px 0', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <p style={{ color: '#94A3B8', fontSize: '12px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                            <strong style={{ color: '#64748B' }}>Disclaimer:</strong> This roadmap is a structured guide, not a guarantee. 
                            Course prices may change. Timelines are estimates based on your stated hours. Always verify course availability and costs before committing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapPage;
