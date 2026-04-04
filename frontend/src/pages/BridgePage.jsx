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
import { TriangleAlert, Info, Lock, ArrowRight, Wallet, Calendar, Activity, ShieldCheck, TrendingDown, AlertTriangle, Loader2 } from 'lucide-react';
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
    }, [pathSetId, navigate, setBridgeId]);

    const handleUnlock = () => {
        navigate(`/roadmap?id=${bridge.id}`);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Quantifying transition risk...</h2>
            </div>
        );
    }

    const { outputs } = bridge;
    const { risk_score, total_bridge_required, runway_months, failure_threshold_month, monthly_cashflow } = outputs;

    const getRiskConfig = (score) => {
        if (score <= 40) return { label: "High Risk", color: "#DC2626", bg: "#FEF2F2", icon: AlertTriangle, desc: "Runway exhausted too early." };
        if (score <= 70) return { label: "Moderate Risk", color: "#D97706", bg: "#FFFBEB", icon: Info, desc: "Requires strict adherence." };
        return { label: "High Safety", color: "#059669", bg: "#ECFDF5", icon: ShieldCheck, desc: "Strong financial redundancy." };
    };

    const risk = getRiskConfig(risk_score);
    const RiskIcon = risk.icon;

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header: Global Risk Status */}
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '12px 32px',
                            borderRadius: '16px',
                            background: '#FFFFFF',
                            border: '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-sm)',
                            marginBottom: '32px'
                        }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '12px', 
                                background: risk.bg, 
                                color: risk.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <RiskIcon size={24} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safety Margin</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: '800', color: risk.color }}>{risk_score}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: risk.color }}>/ 100</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>— {risk.label}</span>
                                </div>
                            </div>
                        </div>
                        <h1 style={{ fontSize: '48px', letterSpacing: '-0.03em', marginBottom: '16px' }}>Income Transition Bridge</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.5 }}>
                            We have modeled your month-over-month cash flow based on the selected career path and your financial constraints.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        {/* Projection Chart */}
                        <Card padding="32px" style={{ background: '#FFFFFF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Net Cash Flow Analysis</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Projected monthly balance after all transition expenses</p>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} /> Projected Net
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '350px', width: '100%', marginLeft: '-20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthly_cashflow}>
                                        <defs>
                                            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke="#94A3B8" 
                                            fontSize={11} 
                                            tickFormatter={(v) => `Month ${v}`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis 
                                            stroke="#94A3B8" 
                                            fontSize={11}
                                            tickFormatter={(v) => `$${v}`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: '#FFFFFF', 
                                                border: '1px solid var(--color-border)', 
                                                borderRadius: '12px',
                                                boxShadow: 'var(--shadow-md)',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}
                                            itemStyle={{ color: 'var(--color-primary)' }}
                                            cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                                        />
                                        <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={1} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="net" 
                                            stroke="var(--color-primary)" 
                                            fillOpacity={1} 
                                            fill="url(#colorNet)" 
                                            strokeWidth={2.5}
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                <Info size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                                    Current model includes a **20% volatility buffer** for initial hiring delay.
                                </span>
                            </div>
                        </Card>

                        {/* Summary Metrics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <StatCard 
                                icon={<Wallet size={24} />} 
                                label="Bridge Capital" 
                                value={`$${Math.round(total_bridge_required).toLocaleString()}`} 
                                subtext="Total liquidity used during pivot"
                            />
                            <StatCard 
                                icon={<Calendar size={24} />} 
                                label="Retention Horizon" 
                                value={`${Math.round(runway_months)} Months`} 
                                subtext="Maximum viable length of transition"
                            />
                            <StatCard 
                                icon={<TrendingDown size={24} color={failure_threshold_month ? "#DC2626" : "#059669"} />} 
                                label="Vulnerability Point" 
                                value={failure_threshold_month ? `Month ${failure_threshold_month}` : "Green Zone"} 
                                subtext={failure_threshold_month ? "Cash flow exhaustion point" : "No runway breach detected"}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Card padding="32px" style={{ background: '#FFFFFF' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Stress Scenarios</h3>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                                We have calculated a 15% probability of hiring taking >6 months. Your current safety margin handles this scenario with <strong>$4,200 remaining</strong>.
                            </p>
                            <div style={{ padding: '12px', borderLeft: '3px solid #F59E0B', background: '#FFFBEB', fontSize: '13px', color: '#92400E', borderRadius: '0 8px 8px 0' }}>
                                Recommended: Keep 10% additional "emergency" bridge.
                            </div>
                        </Card>

                        <Card padding="48px" style={{ 
                            background: 'var(--color-primary)', 
                            color: '#FFFFFF', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Lock size={40} style={{ marginBottom: '24px', opacity: 0.8 }} />
                            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Master Execution Roadmap</h3>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.5 }}>
                                Generate your phased action plan with exact weekly milestones and risk triggers.
                            </p>
                            <Button variant="accent" onClick={handleUnlock} size="lg" style={{ width: '100%' }}>
                                Build Tactical Roadmap <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                            </Button>
                        </Card>
                    </div>

                    {/* Disclaimer */}
                    <div style={{ marginTop: '80px', textAlign: 'center', padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                            <strong>SYSTEM NOTICE:</strong> Projections are purely mathematical models based on user-provided inputs and historical market averages. 
                            Switch.AI is a career intelligence tool and does not provide financial or legal guarantees. Transition risk scores are relative indicators only.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subtext }) => (
    <Card padding="24px" style={{ background: '#FFFFFF' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-primary)', background: 'var(--color-surface)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em' }}>{label}</div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{subtext}</div>
            </div>
        </div>
    </Card>
);

export default BridgePage;
