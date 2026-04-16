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
import { Info, Lock, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
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
    const [selectedHorizon, setSelectedHorizon] = useState(9);

    const params = new URLSearchParams(location.search);
    const pathSetId = params.get('id');

    useEffect(() => {
        if (!pathSetId) {
            navigate('/options');
            return;
        }

        const fetchBridge = async () => {
            try {
                const bridgeData = await endpoints.getSalaryBridge(pathSetId);
                setBridge(bridgeData);
                setBridgeId(bridgeData.id);
            } catch (error) {
                console.error("Failed to fetch bridge", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBridge();
    }, [pathSetId, navigate, setBridgeId]);

    const handleUnlock = () => {
        navigate(`/roadmap?id=${bridge.id}&horizon=${selectedHorizon}`);
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
    const isCritical = risk_score <= 40;

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '120px' }}>
            {/* 1. DOMINANT RISK HEADER */}
            <div style={{ 
                background: isCritical ? '#EF4444' : '#FFFFFF', 
                color: isCritical ? '#FFFFFF' : 'var(--color-text)',
                padding: '120px 24px 80px', 
                textAlign: 'center',
                borderBottom: isCritical ? 'none' : '1px solid var(--color-border)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ 
                        fontSize: '140px', 
                        fontWeight: '900', 
                        lineHeight: 0.8, 
                        letterSpacing: '-0.06em', 
                        marginBottom: '40px',
                        color: isCritical ? '#FFFFFF' : 'var(--color-accent)'
                    }}>
                        {risk_score}
                    </div>
                    {isCritical ? (
                        <h1 style={{ fontSize: '80px', fontWeight: '900', letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: '24px' }}>
                            Do not switch yet.
                        </h1>
                    ) : (
                        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                            Your Safety Level
                        </h1>
                    )}
                    <p style={{ 
                        fontSize: '20px', 
                        opacity: isCritical ? 0.9 : 0.7, 
                        maxWidth: '600px', 
                        margin: '0 auto', 
                        fontWeight: '600',
                        lineHeight: 1.5
                    }}>
                        {isCritical 
                            ? "Your current financial buffer cannot absorb this transition. We recommend pausing until your capital or costs are optimized."
                            : `Based on your analysis, you have a ${Math.round(runway_months)} month runway. Here is your definitive financial pathway.`
                        }
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 24px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '80px' }}>
                        
                        {/* 2. CASH FLOW CHART */}
                        <Card padding="40px" style={{ background: '#FFFFFF' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '4px', letterSpacing: '-0.01em' }}>Monthly Cash Flow</h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>The moment your savings start burning and recovering.</p>
                            </div>

                            <div style={{ height: '400px', width: '100%', marginLeft: '-20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthly_cashflow}>
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                                                <stop offset="50%" stopColor="var(--color-accent)" stopOpacity={0} />
                                                <stop offset="50%" stopColor="#EF4444" stopOpacity={0} />
                                                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-accent)" />
                                                <stop offset="50%" stopColor="var(--color-accent)" />
                                                <stop offset="50%" stopColor="#EF4444" />
                                                <stop offset="100%" stopColor="#EF4444" />
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
                                            style={{ fontWeight: '700' }}
                                        />
                                        <YAxis 
                                            stroke="#94A3B8" 
                                            fontSize={11}
                                            tickFormatter={(v) => `₹${v.toLocaleString()}`}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{ fontWeight: '700' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                background: '#FFFFFF', 
                                                border: '1px solid var(--color-border)', 
                                                borderRadius: '12px',
                                                boxShadow: 'var(--shadow-lg)',
                                                fontSize: '13px',
                                                fontWeight: '900'
                                            }}
                                            itemStyle={{ color: 'var(--color-accent)' }}
                                            cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                                        />
                                        <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={2} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="net" 
                                            stroke="url(#strokeColor)" 
                                            fillOpacity={1} 
                                            fill="url(#splitColor)" 
                                            strokeWidth={4}
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* 3. NARRATIVE STAT CARDS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1.5, color: 'var(--color-text)' }}>
                                    You need <strong>₹{Math.round(total_bridge_required).toLocaleString()}</strong> in savings to cover this transition safely.
                                </div>
                            </div>
                            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1.5, color: 'var(--color-text)' }}>
                                    Your current savings cover <strong>{Math.round(runway_months)} months</strong> — focusing on a 12-month safety window.
                                </div>
                            </div>
                            <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1.5, color: 'var(--color-text)' }}>
                                    {failure_threshold_month 
                                        ? `If your savings run out, it happens at month ${failure_threshold_month}.` 
                                        : "Your current plan maintains a positive capital balance indefinitely."}
                                </div>
                            </div>
                            
                            <div style={{ marginTop: 'auto', padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <Info size={18} style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }} />
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, fontWeight: '600' }}>
                                        We've factored in a 20% stability buffer for market fluctuations and recruitment delays.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. UPGRADE CTA */}
                    <Card padding="64px" style={{ 
                        background: '#0F172A', 
                        color: '#FFFFFF', 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '32px',
                        border: 'none',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ maxWidth: '640px' }}>
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: 'rgba(255,255,255,0.1)', 
                                borderRadius: '20px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 32px'
                            }}>
                                <Lock size={32} color="#FFFFFF" />
                            </div>
                            <h3 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '20px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                                Build Your Execution Roadmap
                            </h3>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.6, fontWeight: '500' }}>
                                The analysis is the foundation. Now get the exact plan to navigate these risks and land your target role without compromising your security.
                            </p>

                            {/* Horizon Selector */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                                    Choose your plan duration
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    {[
                                        { months: 6, label: '6 Months', sub: 'Aggressive' },
                                        { months: 9, label: '9 Months', sub: 'Balanced' },
                                        { months: 12, label: '1 Year', sub: 'Conservative' }
                                    ].map(({ months, label, sub }) => (
                                        <div
                                            key={months}
                                            onClick={() => setSelectedHorizon(months)}
                                            style={{
                                                flex: 1,
                                                padding: '16px 12px',
                                                borderRadius: '16px',
                                                border: `2px solid ${selectedHorizon === months ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}`,
                                                background: selectedHorizon === months ? 'rgba(255,255,255,0.15)' : 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '4px' }}>{label}</div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={handleUnlock} size="lg" style={{ width: '100%', maxWidth: '360px', height: '60px', fontSize: '18px', fontWeight: '800' }}>
                                Build My {selectedHorizon === 12 ? '1-Year' : `${selectedHorizon}-Month`} Roadmap <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                            </Button>
                        </div>

                    </Card>

                    {/* Disclaimer */}
                    <div style={{ marginTop: '80px', textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, fontWeight: '600' }}>
                            <strong>Disclaimer:</strong> This bridge analysis is a deterministic model based on your inputs and current market data. 
                            While conservative, it represents a guided projection, not a financial guarantee.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BridgePage;
