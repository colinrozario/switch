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
        { month: 'Mo 1', val: 5000 }, { month: 'Mo 2', val: 5200 }, { month: 'Mo 3', val: 4800 }, 
        { month: 'Mo 4', val: 5500 }, { month: 'Mo 5', val: 4200 }, { month: 'Mo 6', val: 7800 }, 
        { month: 'Mo 7', val: 8400 }, { month: 'Mo 8', val: 9200 }, { month: 'Mo 9', val: 9800 }, 
        { month: 'Mo 10', val: 10500 }, { month: 'Mo 11', val: 11200 }, { month: 'Mo 12', val: 12500 }
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
                        fontSize: 'clamp(48px, 8vw, 84px)', 
                        lineHeight: 1.1, 
                        marginBottom: '24px',
                        letterSpacing: '-0.04em',
                        color: 'var(--color-text)'
                    }}>
                        Switch careers without <span style={{ color: 'var(--color-accent)' }}>the stress.</span>
                    </h1>
                    
                    <p style={{ 
                        fontSize: 'clamp(18px, 2.5vw, 24px)', 
                        color: 'var(--color-text-secondary)', 
                        maxWidth: '700px', 
                        margin: '0 auto 48px',
                        lineHeight: 1.5
                    }}>
                        Stop guessing your next move. We use real data to help you plan your career transition with total confidence and zero blind spots.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button size="lg" onClick={() => navigate('/diagnosis')}>
                            Switch Now
                        </Button>
                        <Button size="lg" variant="outline">
                            How it works
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
                                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-accent)' }}>+$42,500</div>
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
                                                                ${payload[0].value.toLocaleString()}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <ReferenceLine 
                                                y={5000} 
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
            <section style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                        Smarter tools for your next big move.
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
                        All the analysis you need to make a confident career change.
                    </p>
                </div>

                <div className="bento-grid">
                    <div style={{ gridColumn: 'span 8' }}>
                        <Card style={{ height: '100%', display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-text)' }}>
                                    <BarChart3 size={24} />
                                </div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Pay Gap Planner</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    See exactly when your new paycheck will cover your old expenses. We calculate your "payout date" so you can plan your savings perfectly.
                                </p>
                            </div>
                            <div style={{ flex: 1, height: '200px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={64} style={{ color: 'var(--color-accent)', opacity: 0.1 }} />
                            </div>
                        </Card>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-text)' }}>
                                <Shield size={24} />
                            </div>
                            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Keep it Private</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                                Plan your exit quietly. No LinkedIn notifications or recruiter alerts. Your data stays safe and secure in your private dashboard.
                            </p>
                        </Card>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-text)' }}>
                                <Target size={24} />
                            </div>
                            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Skill Checkup</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                                We check your current skills against thousands of job listings. We'll show you the 2-3 specific things you need to learn to get hired.
                            </p>
                        </Card>
                    </div>

                    <div style={{ gridColumn: 'span 8' }}>
                        <Card style={{ height: '100%', display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ flex: 1, height: '200px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ height: '32px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--color-border)', width: i === 1 ? '90%' : (i === 2 ? '70%' : '80%') }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-text)' }}>
                                    <Map size={24} />
                                </div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Your Step-by-Step Plan</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    No more learning for the sake of learning. Get a clear, weekly strategy based on your target salary and risk level.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '120px 24px', 
                background: '#F8FAFC', 
                color: 'var(--color-text)', 
                textAlign: 'center',
                borderTop: '1px solid var(--color-border)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                        Ready to plan your move?
                    </h2>
                    <p style={{ fontSize: '20px', color: 'var(--color-text-secondary)', marginBottom: '48px' }}>
                        It takes just 2 minutes to start your first simulation. It's free while we're in early access.
                    </p>
                    <Button size="lg" onClick={() => navigate('/diagnosis')}>
                        Assess My Profile
                    </Button>
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
