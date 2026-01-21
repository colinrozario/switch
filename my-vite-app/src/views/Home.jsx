import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import heroImage from '../assets/hero_image.png';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 5%',
                position: 'relative'
            }}>
                {/* Brand Title - Massive */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(80px, 15vw, 240px)', // Massive responsive text
                        fontWeight: '500',
                        lineHeight: '0.9',
                        color: '#FFFFFF',
                        marginBottom: '40px',
                        letterSpacing: '-0.04em'
                    }}
                >
                    switch.
                </motion.h1>

                {/* Subtext and CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '32px',
                        maxWidth: '600px'
                    }}
                >
                    <p style={{
                        fontSize: '20px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        Switch careers without the freefall. We model salary bridges, failure scenarios, and realistic timelines so you can move safely.
                    </p>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Button onClick={() => navigate('/intake')}>
                            Start Safe Transition
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/paths')}>
                            View Sample Plan
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Bento Grid Section */}
            <section style={{ padding: '0 5%', maxWidth: '1440px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {/* Feature 1: The Visual (Span 2 columns if possible) */}
                    <Card className="col-span-1 md:col-span-2" style={{ padding: 0, minHeight: '400px', gridColumn: 'span 2' }}>
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
                        <div style={{ position: 'absolute', bottom: '40px', left: '40px', zIndex: 3 }}>
                            <h3 style={{ fontSize: '32px', marginBottom: '8px' }}>Visual Roadmaps</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>See your path clearly before you leap.</p>
                        </div>
                    </Card>

                    {/* Feature 2: Data */}
                    <Card style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{
                                fontSize: '64px',
                                color: 'var(--color-primary)',
                                fontWeight: '700',
                                lineHeight: 1
                            }}>
                                100%
                            </div>
                            <div style={{ marginTop: '16px', fontSize: '24px' }}>Data Driven</div>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Real salary data and market demand analysis.
                        </p>
                    </Card>

                    {/* Feature 3: Safety */}
                    <Card style={{ minHeight: '300px', background: 'var(--color-primary)', color: '#000' }}>
                        <h3 style={{ fontSize: '32px', marginBottom: '16px', color: '#000' }}>Safety First</h3>
                        <p style={{ fontSize: '18px', lineHeight: '1.5', color: 'rgba(0,0,0,0.7)' }}>
                            We prioritize minimizing financial risk. Our algorithms calculate the safest bridge tailored to your savings.
                        </p>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Home;
