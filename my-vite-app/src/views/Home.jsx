import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Section from '../components/Layout/Section';
import { TrendingUp, Activity, Shield } from 'lucide-react';

const TabletScroll = () => {
    const { scrollYProgress } = useScroll();
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);

    return (
        <div style={{ perspective: '1000px', height: '600px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <motion.div
                style={{
                    width: '80%',
                    maxWidth: '900px',
                    height: '100%',
                    rotateX: rotateX,
                    scale: scale,
                    opacity: opacity,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: '#111',
                    border: '8px solid #333',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                    position: 'relative'
                }}
            >
                {/* Tablet Screen Content */}
                <div style={{ padding: '40px', background: 'linear-gradient(to bottom, #1a1a1a, #000)' }}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.1)', marginBottom: '10px' }}></div>
                            <div style={{ height: '20px', width: '80%', background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                        </div>
                        <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.1)', marginBottom: '10px' }}></div>
                            <div style={{ height: '20px', width: '60%', background: '#ff5252', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '300px' }}>
                        <div style={{ height: '30px', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>
                        {/* Mock Chart */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '10px' }}>
                            {[30, 45, 60, 50, 70, 85, 90, 100].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: i > 5 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ paddingBottom: '100px' }}>
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                paddingTop: '120px'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: 'clamp(60px, 10vw, 150px)',
                        fontWeight: '600',
                        lineHeight: '0.9',
                        marginBottom: '24px',
                        letterSpacing: '-0.03em'
                    }}
                >
                    switch.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: '24px',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '600px',
                        marginBottom: '40px'
                    }}
                >
                    We model salary bridges, failure scenarios, and realistic timelines so you can <span style={{ color: 'var(--color-primary)' }}>move without the fear.</span>
                </motion.p>

                <Button onClick={() => navigate('/diagnosis')} style={{ padding: '16px 48px', fontSize: '1.2rem', marginBottom: '60px' }}>
                    Start Diagnosis
                </Button>

                {/* Tablet Scroll Effect */}
                <TabletScroll />
            </section>

            <Section>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '700' }}>Why is it scary?</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { title: "Income Gaps", desc: "Fear of salary drops during the transition period.", icon: TrendingUp },
                        { title: "Generic Advice", desc: "\"Just follow your passion\" doesn't pay the bills.", icon: Activity },
                        { title: "Hidden Risks", desc: "Unknown market demands and skill gaps.", icon: Shield },
                    ].map((item, i) => (
                        <Card key={i} style={{ padding: '40px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                <item.icon size={40} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default Home;
