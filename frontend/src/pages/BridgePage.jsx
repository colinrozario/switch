import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ReferenceLine 
} from 'recharts';
import { TriangleAlert, Info, Lock, ArrowRight, Wallet, Calendar, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const BridgePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setBridgeId } = useStore();
    const [bridge, setBridge] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(location.search);
    const pathSetId = params.get('id');

    useEffect(() => {
        if (!pathSetId) {
            navigate('/options');
            return;
        }

        const fetchBridge = async () => {
            try {
                const response = await endpoints.getSalaryBridge(pathSetId);
                setBridge(response.data);
                setBridgeId(response.data.id);
            } catch (error) {
                console.error("Failed to fetch bridge", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBridge();
    }, [pathSetId]);

    const handleUnlock = () => {
        // Simulate payment success
        navigate(`/roadmap?id=${bridge.id}`);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={40} className="spin-slow" style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
                <h2 style={{ color: 'var(--color-primary)' }}>Quantifying financial risk...</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Building month-by-month cash flow projections.</p>
            </div>
        );
    }

    const { outputs } = bridge;
    const { risk_score, total_bridge_required, runway_months, failure_threshold_month, monthly_cashflow } = outputs;

    // FE-04: Strict Risk Score Warning
    const getRiskLevel = (score) => {
        if (score <= 40) return { label: "DO NOT SWITCH YET", color: "#ff4444", bg: "rgba(255, 68, 68, 0.1)" };
        if (score <= 70) return { label: "SWITCH WITH SAFEGUARDS", color: "#ffbb33", bg: "rgba(255, 187, 51, 0.1)" };
        return { label: "SAFE TO PROCEED", color: "var(--color-primary)", bg: "rgba(215, 254, 3, 0.1)" };
    };

    const risk = getRiskLevel(risk_score);

    return (
        <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header: Risk Score (FE-04) */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: '8px', 
                        padding: '32px 64px',
                        borderRadius: 'var(--radius-lg)',
                        background: risk.bg,
                        border: `1px solid ${risk.color}`,
                        marginBottom: '24px'
                    }}>
                        <span style={{ fontSize: '0.9rem', color: risk.color, fontWeight: '700', letterSpacing: '2px' }}>TRANSITION RISK SCORE</span>
                        <span style={{ fontSize: '5rem', fontWeight: '800', color: risk.color, lineHeight: 1 }}>{risk_score}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: risk.color }}>{risk.label}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '80px' }}>
                    {/* Left: Cash Flow Chart */}
                    <Card style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Cash Flow Projection</h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} /> Net Income
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '320px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthly_cashflow}>
                                    <defs>
                                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={12} 
                                        tickFormatter={(v) => `M${v}`}
                                    />
                                    <YAxis 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={12}
                                        tickFormatter={(v) => `$${v}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        labelStyle={{ color: 'var(--color-primary)' }}
                                    />
                                    <ReferenceLine y={0} stroke="#ff4444" strokeDasharray="3 3" />
                                    <Area 
                                        type="monotone" 
                                        dataKey="net" 
                                        stroke="var(--color-primary)" 
                                        fillOpacity={1} 
                                        fill="url(#colorNet)" 
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                            <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Includes 20% uncertainty buffer on target role salary.
                        </p>
                    </Card>

                    {/* Right: Key Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <StatCard 
                            icon={<Wallet size={24} />} 
                            label="Total Bridge Required" 
                            value={`$${Math.round(total_bridge_required).toLocaleString()}`} 
                            subtext="Total liquid capital consumed during switch"
                        />
                        <StatCard 
                            icon={<Calendar size={24} />} 
                            label="Savings Runway" 
                            value={`${Math.round(runway_months)} Months`} 
                            subtext="At current monthly expense level"
                        />
                        <StatCard 
                            icon={<TriangleAlert size={24} color={failure_threshold_month ? "#ff4444" : "var(--color-primary)"} />} 
                            label="Failure Threshold" 
                            value={failure_threshold_month ? `Month ${failure_threshold_month}` : "Safe Margin"} 
                            subtext={failure_threshold_month ? "Month where savings are exhausted" : "Savings cover the entire transition"}
                        />
                    </div>
                </div>

                {/* Unlock Roadmap CTA */}
                <Card style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '64px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Lock size={48} style={{ color: 'var(--color-primary)', marginBottom: '24px' }} />
                        <h3 style={{ fontSize: '2rem', marginBottom: '16px' }}>Unlock Your Master Roadmap</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                            Get a phased weekly plan with specific milestones, failure triggers, and fallback actions tailored to this path.
                        </p>
                        <Button onClick={handleUnlock} style={{ padding: '20px 48px', fontSize: '1.2rem' }}>
                            Build My Roadmap <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                        </Button>
                    </div>
                </Card>

                {/* FE-03: Mandatory Disclaimer */}
                <p style={{ marginTop: '64px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem', maxWidth: '800px', margin: '64px auto 0' }}>
                    <strong>Disclaimer:</strong> These figures are estimates based on your inputs and conservative salary data. 
                    This is a model, not a guarantee of outcome. Not financial advice.
                </p>
            </motion.div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subtext }) => (
    <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--color-primary)', marginTop: '4px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>{subtext}</div>
            </div>
        </div>
    </Card>
);

export default BridgePage;
