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
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Checking your safety levels...</h2>
            </div>
        );
    }

    const { outputs } = bridge;
    const { risk_score, total_bridge_required, runway_months, failure_threshold_month, monthly_cashflow } = outputs;

    const getRiskConfig = (score) => {
        if (score <= 40) return { label: "Careful!", color: "#DC2626", bg: "#FEF2F2", icon: AlertTriangle, desc: "Runway gets tight early." };
        if (score <= 70) return { label: "Looking Good", color: "#D97706", bg: "#FFFBEB", icon: Info, desc: "Follow the plan closely." };
        return { label: "Very Safe", color: "#059669", bg: "#ECFDF5", icon: ShieldCheck, desc: "You have plenty of backup." };
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
                                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Safety Score</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: '800', color: risk.color }}>{risk_score}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: risk.color }}>/ 100</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>— {risk.label}</span>
                                </div>
                            </div>
                        </div>
                        <h1 style={{ fontSize: '48px', letterSpacing: '-0.03em', marginBottom: '16px' }}>Your Money Map</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.5 }}>
                            This shows how your income will change over time and when you'll start earning more than you do now.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        {/* Projection Chart */}
                        <Card padding="32px" style={{ background: '#FFFFFF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Your Monthly Balance</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>What's left in your pocket each month after expenses.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} /> Predicted Balance
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '350px', width: '100%', marginLeft: '-20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthly_cashflow}>
                                        <defs>
                                            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15}/>
                                                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke="#94A3B8" 
                                            fontSize={11} 
                                            tickFormatter={(v) => `Mo ${v}`}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{ fontWeight: '600' }}
                                        />
                                        <YAxis 
                                            stroke="#94A3B8" 
                                            fontSize={11}
                                            tickFormatter={(v) => `₹${v}`}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{ fontWeight: '600' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: '#FFFFFF', 
                                                border: '1px solid var(--color-border)', 
                                                borderRadius: '12px',
                                                boxShadow: 'var(--shadow-md)',
                                                fontSize: '12px',
                                                fontWeight: '800'
                                            }}
                                            itemStyle={{ color: 'var(--color-accent)' }}
                                            cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                                        />
                                        <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={1} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="net" 
                                            stroke="var(--color-accent)" 
                                            fillOpacity={1} 
                                            fill="url(#colorNet)" 
                                            strokeWidth={3}
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                <Info size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                    We've added a **20% safety buffer** in case it takes a little longer to get hired.
                                </span>
                            </div>
                        </Card>

                        {/* Summary Metrics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <StatCard 
                                icon={<Wallet size={24} />} 
                                label="Savings Needed" 
                                value={`$${Math.round(total_bridge_required).toLocaleString()}`} 
                                subtext="Total cushion used for the move"
                            />
                            <StatCard 
                                icon={<Calendar size={24} />} 
                                label="How Long You're Safe" 
                                value={`${Math.round(runway_months)} Months`} 
                                subtext="How long your savings will last"
                            />
                            <StatCard 
                                icon={<TrendingDown size={24} color={failure_threshold_month ? "#DC2626" : "#059669"} />} 
                                label="The Red Zone" 
                                value={failure_threshold_month ? `Month ${failure_threshold_month}` : "Safe Zone"} 
                                subtext={failure_threshold_month ? "When you'll need a paycheck" : "No risks detected!"}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Card padding="32px" style={{ background: '#FFFFFF' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F1F5F9', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>What if things change?</h3>
                            </div>
                            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px', fontWeight: '500' }}>
                                Even if it takes 6 months to find a job, your current plan still leaves you with <strong>$4,200</strong> in your pocket.
                            </p>
                            <div style={{ padding: '12px', borderLeft: '3px solid #CBD5E1', background: '#F8FAFC', fontSize: '13px', color: 'var(--color-text-secondary)', borderRadius: '0 8px 8px 0', fontWeight: '700' }}>
                                Tip: Keep a small "emergency fund" just in case.
                            </div>
                        </Card>

                        <Card padding="48px" style={{ 
                            background: '#0F172A', 
                            color: '#FFFFFF', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Lock size={40} style={{ marginBottom: '24px', opacity: 0.8 }} />
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>Your Step-by-Step Plan</h3>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.5, fontWeight: '500' }}>
                                See exactly what to do each week to make your career move a success.
                            </p>
                            <Button onClick={handleUnlock} size="lg" style={{ width: '100%' }}>
                                Get My Plan <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                            </Button>
                        </Card>
                    </div>

                    {/* Disclaimer */}
                    <div style={{ marginTop: '80px', textAlign: 'center', padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                            <strong>Just so you know:</strong> These are best-guess plans based on your info and common market trends. 
                            Switch is a helpful guide, but not a financial guarantee.
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
            <div style={{ color: 'var(--color-text)', background: '#F1F5F9', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em' }}>{label}</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text)' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', fontWeight: '600' }}>{subtext}</div>
            </div>
        </div>
    </Card>
);

export default BridgePage;
