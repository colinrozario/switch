import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Section from '../components/Layout/Section';
import Ticker from '../components/UI/Ticker';
import heroImage from '../assets/hero_image.png';
import { ArrowRight, Shield, TrendingUp, Activity, Users, Star } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 5% 40px',
                position: 'relative',
                paddingTop: '120px' // offset for fixed nav
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(80px, 15vw, 240px)',
                        fontWeight: '500',
                        lineHeight: '0.8',
                        color: '#FFFFFF',
                        marginBottom: '24px',
                        letterSpacing: '-0.04em'
                    }}
                >
                    switch.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        fontSize: '24px',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '600px',
                        marginBottom: '40px',
                        lineHeight: '1.4'
                    }}
                >
                    The conservative career strategist. We model salary bridges, failure scenarios, and realistic timelines so you can <span style={{ color: 'var(--color-primary)' }}>move without the fear.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}
                >
                    <Button onClick={() => navigate('/intake')}>
                        Start Safe Transition
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/paths')}>
                        View Sample Plan
                    </Button>
                </motion.div>

                {/* Ticker for Social Proof/Trust */}
                <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '40px' }}>
                    <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                        Helping professionals transition from
                    </p>
                    <Ticker items={[
                        "Marketing → Product", "Sales → Tech", "Consulting → Strategy",
                        "Teaching → EdTech", "Finance → Fintech", "Retail → E-commerce"
                    ]} />
                </div>
            </section>

            {/* Problem Section */}
            <Section>
                <motion.div {...fadeIn} style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '24px' }}>Why is it so scary?</h2>
                    <p style={{ fontSize: '20px', color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        Most career advice is overly optimistic. We focus on the risks, so you don't have to worry about them.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { title: "Income Gaps", desc: "Fear of salary drops during the transition period.", icon: TrendingUp },
                        { title: "Generic Advice", desc: "\"Just follow your passion\" doesn't pay the bills.", icon: Activity },
                        { title: "Hidden Risks", desc: "Unknown market demands and skill gaps.", icon: Shield },
                    ].map((item, i) => (
                        <Card key={i} style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                <item.icon size={40} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>{item.title}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', textAlign: 'center' }}>{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Features / Bento Grid */}
            <Section>
                <motion.div {...fadeIn} style={{ marginBottom: '40px', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '700' }}>The switch. System</h2>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {/* Feature 1: The Visual (Span 2 columns if possible) */}
                    <Card className="col-span-1 md:col-span-2" style={{ padding: 0, minHeight: '500px', gridColumn: 'span 2' }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, transparent, black)',
                            zIndex: 2
                        }} />
                        <img
                            src={heroImage}
                            alt="Dashboard Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: 0.8
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: '60px', left: '60px', zIndex: 3 }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                                padding: '8px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                Feature Highlight
                            </div>
                            <h3 style={{ fontSize: '40px', marginBottom: '16px', fontWeight: '700' }}>Visual Roadmaps</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '20px', maxWidth: '500px' }}>
                                A timeline that models your bank account, not just your career milestones. See exactly when you'll be back to your current income.
                            </p>
                        </div>
                    </Card>

                    {/* Feature 2: Data */}
                    <Card style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{
                                fontSize: '80px',
                                color: 'var(--color-primary)',
                                fontWeight: '700',
                                lineHeight: 1
                            }}>
                                100%
                            </div>
                            <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: '600' }}>Data Driven</div>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
                            Real salary data and market demand analysis scraped from over 50 job boards.
                        </p>
                    </Card>

                    {/* Feature 3: Safety */}
                    <Card style={{ minHeight: '340px', background: 'var(--color-primary)', color: '#000' }}>
                        <h3 style={{ fontSize: '32px', marginBottom: '16px', color: '#000', fontWeight: '700' }}>Safety First</h3>
                        <p style={{ fontSize: '20px', lineHeight: '1.4', color: 'rgba(0,0,0,0.8)' }}>
                            We prioritize minimizing financial risk. Our algorithms calculate the safest bridge tailored to your liquid savings.
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                            <div style={{ height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '80%' }}
                                    transition={{ duration: 1.5 }}
                                    style={{ height: '100%', background: '#000' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', fontWeight: '600' }}>
                                <span>Risk Level</span>
                                <span>Low</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </Section>

            {/* How it Works */}
            <Section>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '24px' }}>How it Works</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Three steps to a safer future.</p>
                    </div>

                    {[
                        { step: "01", title: "Input Profile", desc: "Tell us about your current role, salary, and savings." },
                        { step: "02", title: "Analyze Risk", desc: "Our AI calculates your 'Switch Score' and financial runway." },
                        { step: "03", title: "Generate Path", desc: "Get a step-by-step roadmap with specific milestones." }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            {...fadeIn}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '40px',
                                borderBottom: '1px solid var(--color-border)', paddingBottom: '40px'
                            }}
                        >
                            <div style={{ fontSize: '64px', fontWeight: '700', color: 'var(--color-surface-hover)', letterSpacing: '-0.05em' }}>
                                {item.step}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* CTA Section */}
            <Section style={{ padding: '100px 5%', textAlign: 'center' }}>
                <div style={{
                    background: 'radial-gradient(circle at center, rgba(215, 254, 3, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    padding: '80px 20px'
                }}>
                    <h2 style={{ fontSize: '64px', fontWeight: '700', marginBottom: '32px', lineHeight: '1.1' }}>
                        Ready to maximize<br />your career?
                    </h2>
                    <Button onClick={() => navigate('/intake')} style={{ transform: 'scale(1.2)' }}>
                        Start Your Transition Now
                    </Button>
                </div>
            </Section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: '60px 5%', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', marginBottom: '24px' }}>switch.</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '40px' }}>
                    {['Privacy', 'Terms', 'Contact', 'Twitter'].map(link => (
                        <a key={link} href="#" style={{ fontSize: '14px' }}>{link}</a>
                    ))}
                </div>
                <p style={{ fontSize: '14px', opacity: 0.5 }}>© 2026 Colin Michael. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
