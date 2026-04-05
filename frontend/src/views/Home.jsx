import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { TrendingUp, Activity, Shield, CheckCircle, ArrowRight, Lock, Zap, PieChart, Map, User, ChevronRight, BarChart3, Target } from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell, 
    ReferenceLine 
} from 'recharts';

const Home = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const dashboardData = [
        { month: 'Mo 1', val: 150000 }, { month: 'Mo 2', val: 155000 }, { month: 'Mo 3', val: 145000 }, 
        { month: 'Mo 4', val: 162000 }, { month: 'Mo 5', val: 130000 }, { month: 'Mo 6', val: 245000 }, 
        { month: 'Mo 7', val: 260000 }, { month: 'Mo 8', val: 285000 }, { month: 'Mo 9', val: 310000 }, 
        { month: 'Mo 10', val: 335000 }, { month: 'Mo 11', val: 360000 }, { month: 'Mo 12', val: 410000 }
    ];
    
    return (
        <div style={{ background: '#FFFFFF', minHeight: '100vh', color: 'var(--color-text)', overflowX: 'hidden' }}>
            
            {/* Hero Section */}
            <section style={{ 
                minHeight: '90vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '120px 24px 80px',
                textAlign: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at 50% 0%, #F8FAFC 0%, #FFFFFF 100%)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '900px' }}
                >
                    <h1 style={{ 
                        fontSize: 'clamp(40px, 6vw, 72px)', 
                        lineHeight: 1.1, 
                        marginBottom: '24px',
                        letterSpacing: '-0.04em',
                        color: 'var(--color-text)'
                    }}>
                        Plan your career switch without the financial risk.
                    </h1>
                    
                    <p style={{ 
                        fontSize: 'clamp(18px, 2vw, 22px)', 
                        color: 'var(--color-text-secondary)', 
                        maxWidth: '750px', 
                        margin: '0 auto 48px',
                        lineHeight: 1.5,
                        fontWeight: '500'
                    }}>
                        A conservative, step-by-step analysis built around your real constraints.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button size="lg" onClick={() => navigate('/diagnosis')}>
                            Analyze My Profile
                        </Button>
                    </div>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ 
                        marginTop: '80px',
                        width: '100%',
                        maxWidth: '1100px',
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
                        padding: '12px',
                        position: 'relative'
                    }}
                >
                    <div style={{ 
                        background: 'var(--color-surface)', 
                        borderRadius: '16px', 
                        padding: '32px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '24px',
                        textAlign: 'left'
                    }}>
                        {/* Summary Stats */}
                        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Card padding="20px">
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Possible Salary Boost</div>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-accent)' }}>+₹1,50,000</div>
                                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>Payoff in 18 months</div>
                            </Card>
                            <Card padding="20px">
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px', fontWeight: '600' }}>Your Safety Score</div>
                                <div style={{ fontSize: '32px', fontWeight: '800' }}>94/100</div>
                                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', marginTop: '12px' }}>
                                    <div style={{ width: '94%', height: '100%', background: 'var(--color-accent)', borderRadius: '4px' }} />
                                </div>
                            </Card>
                        </div>

                        {/* Main Chart */}
                        <div style={{ gridColumn: 'span 8' }}>
                            <Card padding="24px" style={{ height: '100%', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.01em' }}>Earnings Recovery Plan</div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Projected income growth after switch</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} /> Future
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #BFDBFE' }} /> Gap
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={dashboardData} 
                                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                                            barGap={0}
                                        >
                                            <XAxis 
                                                dataKey="month" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }}
                                                interval={2}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#F8FAFC' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div style={{ 
                                                                background: '#0F172A', 
                                                                padding: '8px 12px', 
                                                                borderRadius: '8px', 
                                                                color: '#FFFFFF', 
                                                                fontSize: '12px', 
                                                                fontWeight: '800',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                            }}>
                                                                ₹{payload[0].value.toLocaleString()}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <ReferenceLine 
                                                y={150000} 
                                                stroke="#E2E8F0" 
                                                strokeDasharray="4 4" 
                                                strokeWidth={2}
                                                label={{ position: 'right', value: 'Old Pay', fill: '#94A3B8', fontSize: 10, fontWeight: 700, offset: 10 }}
                                            />
                                            <Bar 
                                                dataKey="val" 
                                                radius={[4, 4, 0, 0]}
                                                animationDuration={2000}
                                            >
                                                {dashboardData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={index > 4 ? 'var(--color-accent)' : '#DBEAFE'} 
                                                        style={{ transition: 'all 0.3s ease' }}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features / Bento Grid */}
            {/* Features Columns */}
            <section style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Intake</div>
                        <p style={{ fontSize: '18px', color: 'var(--color-text)', lineHeight: 1.6, fontWeight: '500' }}>
                            Record salary data and expenses.
                        </p>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Bridge</div>
                        <p style={{ fontSize: '18px', color: 'var(--color-text)', lineHeight: 1.6, fontWeight: '500' }}>
                            Identify duration between paychecks.
                        </p>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.05em' }}>Roadmap</div>
                        <p style={{ fontSize: '18px', color: 'var(--color-text)', lineHeight: 1.6, fontWeight: '500' }}>
                            Access steps for transition.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section style={{ padding: '120px 24px', background: '#F8FAFC', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '40px', letterSpacing: '-0.02em', marginBottom: '64px', textAlign: 'center' }}>How Switch Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 64px' }}>
                        {[
                            "Input role and financial data.",
                            "Select path from analyzed options.",
                            "Compare savings against transition costs.",
                            "Follow schedule to complete move."
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-accent)', opacity: 0.3, lineHeight: 1 }}>{i + 1}</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', paddingTop: '6px' }}>{step}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '40px', letterSpacing: '-0.02em', marginBottom: '64px', textAlign: 'center' }}>Pricing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {[
                        { title: "Basic", price: "₹3,999", desc: "Profile analysis and bridge calculation." },
                        { title: "Professional", price: "₹11,999", desc: "Dashboard access and simulations." },
                        { title: "Advisory", price: "₹39,999", desc: "Advisor review and roadmap review." }
                    ].map((tier, i) => (
                        <Card key={i} padding="32px" style={{ background: i === 1 ? 'var(--color-surface)' : '#FFFFFF', border: i === 1 ? '2px solid var(--color-accent)' : '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{tier.title}</div>
                            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>{tier.price}</div>
                            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '32px', lineHeight: 1.5, fontWeight: '500' }}>{tier.desc}</p>
                            <Button variant={i === 1 ? 'primary' : 'outline'} style={{ width: '100%' }} onClick={() => navigate('/diagnosis')}>Get Started</Button>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '80px 24px', borderTop: '1px solid var(--color-border)', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-accent)' }}>switch.</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        © 2026 switch Career Intelligence. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
