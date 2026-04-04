import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { TrendingUp, Activity, Shield, CheckCircle, ArrowRight, Lock, Zap, PieChart, Map, User, ChevronRight, BarChart3, Target } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    
    return (
        <div style={{ background: '#FFFFFF', minHeight: '100vh', color: 'var(--color-primary)', overflowX: 'hidden' }}>
            
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
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: 'var(--color-surface)', 
                        padding: '6px 16px', 
                        borderRadius: '99px',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '32px'
                    }}>
                        <span style={{ color: 'var(--color-accent)' }}>New</span> Intelligence engine v2.0 now live
                        <ChevronRight size={14} />
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(48px, 8vw, 84px)', 
                        lineHeight: 1.1, 
                        marginBottom: '24px',
                        letterSpacing: '-0.04em'
                    }}>
                        The career platform for the <span style={{ color: 'var(--color-accent)' }}>risk-averse.</span>
                    </h1>
                    
                    <p style={{ 
                        fontSize: 'clamp(18px, 2.5vw, 24px)', 
                        color: 'var(--color-text-secondary)', 
                        maxWidth: '700px', 
                        margin: '0 auto 48px',
                        lineHeight: 1.4
                    }}>
                        Stop guessing your next move. Use deterministic financial modeling and AI to plan your career transition with zero blind spots.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button size="lg" onClick={() => navigate('/diagnosis')}>
                            Start Your Diagnosis
                        </Button>
                        <Button size="lg" variant="outline">
                            View Methodology
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
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Projected Salary Jump</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>+$42,500</div>
                                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>+24% ROI in 18 months</div>
                            </Card>
                            <Card padding="20px">
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Transition Safety Score</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>94/100</div>
                                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', marginTop: '12px' }}>
                                    <div style={{ width: '94%', height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }} />
                                </div>
                            </Card>
                        </div>

                        {/* Main Chart */}
                        <div style={{ gridColumn: 'span 8' }}>
                            <Card padding="24px" style={{ height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Income Recovery Simulation</div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-primary)' }} />
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F1F5F9' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '12px' }}>
                                    {[40, 55, 45, 60, 35, 80, 95, 110, 125, 140, 155, 170].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h * 0.8}%` }}
                                            transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                                            style={{ 
                                                flex: 1, 
                                                background: i > 4 ? 'var(--color-primary)' : '#F1F5F9',
                                                borderRadius: '4px 4px 0 0'
                                            }} 
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                                    <span>Month 1</span>
                                    <span>Month 6</span>
                                    <span>Month 12</span>
                                    <span>Month 18</span>
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
                        Sophisticated tools for serious moves.
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
                        Professional-grade analysis previously reserved for executive placement.
                    </p>
                </div>

                <div className="bento-grid">
                    <div style={{ gridColumn: 'span 8' }}>
                        <Card style={{ height: '100%', display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ width: '48px', height: '48px', background: 'var(--color-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                                    <BarChart3 size={24} />
                                </div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Salary Bridge Engine</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    Quantify exactly how much runway you need. We calculate your "recovery date"—the moment your new salary exceeds your old one, accounting for inflation and opportunity cost.
                                </p>
                            </div>
                            <div style={{ flex: 1, height: '200px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={64} style={{ opacity: 0.1 }} />
                            </div>
                        </Card>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--color-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                                <Shield size={24} />
                            </div>
                            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Stealth Priority</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                                Plan your exit without alerts. We use encrypted local sandboxes for all your simulation data. No LinkedIn pings, no recruiter tracking.
                            </p>
                        </Card>
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                        <Card style={{ height: '100%' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--color-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                                <Target size={24} />
                            </div>
                            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Skill Gap Diagnosis</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                                Automated analysis of your current experience against 100k+ real hire profiles. Focus only on the 2-3 skills that actually move the needle.
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
                                <div style={{ width: '48px', height: '48px', background: 'var(--color-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
                                    <Map size={24} />
                                </div>
                                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Deterministic Roadmap</h3>
                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                    No more "learning for the sake of learning." Get a week-by-week strategy derived from your specific target salary and risk tolerance.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '120px 24px', 
                background: 'var(--color-primary)', 
                color: '#FFFFFF', 
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                        Ready to plan your exit?
                    </h2>
                    <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', marginBottom: '48px' }}>
                        It takes 2 minutes to run your first simulation. It's free while we're in early access.
                    </p>
                    <Button size="lg" variant="accent" onClick={() => navigate('/diagnosis')}>
                        Assess My Profile
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '80px 24px', borderTop: '1px solid var(--color-border)', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>switch.</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        © 2026 switch Career Intelligence. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
