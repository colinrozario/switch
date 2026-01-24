import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Section from '../components/Layout/Section';
import Ticker from '../components/UI/Ticker';
import { TrendingUp, Activity, Shield, CheckCircle, ArrowRight, Lock, Zap } from 'lucide-react';

// --- Components ---

const BentoCard = ({ title, subtitle, icon: Icon, children, className, style }) => (
    <div className={className} style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        ...style
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {Icon && <div style={{ padding: '8px', background: 'rgba(215, 254, 3, 0.1)', borderRadius: '8px', color: '#d7fe03' }}><Icon size={20} /></div>}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>{title}</h3>
        </div>
        {children}
        {subtitle && <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginTop: 'auto' }}>{subtitle}</p>}
    </div>
);

const TabletScroll = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 3D Transforms
    const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [30, 0, 0, 10]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9])
    const opacity = useTransform(scrollYProgress, [0, 0.1], [0.5, 1]);
    const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

    // Content Switching inside Tablet
    const contentY = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '-66%']);

    return (
        <div ref={containerRef} style={{ height: '300vh', position: 'relative', marginTop: '-50vh' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '1200px' }}>
                <motion.div
                    style={{
                        width: '90%',
                        maxWidth: '1000px',
                        aspectRatio: '16/10',
                        background: '#111',
                        borderRadius: '28px',
                        border: '12px solid #222',
                        boxShadow: '0 50px 200px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                        position: 'relative',
                        rotateX,
                        scale,
                        opacity,
                        y,
                        overflow: 'hidden'
                    }}
                >
                    {/* Tablet Header */}
                    <div style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>app.switch.io</div>
                        <div />
                    </div>

                    {/* Tablet Body (Scrollable Content) */}
                    <div style={{ position: 'relative', height: 'calc(100% - 60px)', overflow: 'hidden' }}>
                        <motion.div style={{ height: '300%', y: contentY, display: 'flex', flexDirection: 'column' }}>

                            {/* Slide 1: Risk Analysis */}
                            <div style={{ flex: 1, padding: '40px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: '#d7fe03', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Analysis</div>
                                    <h2 style={{ fontSize: '40px', lineHeight: '1.1', marginBottom: '20px' }}>Fail-safe your future.</h2>
                                    <p style={{ color: '#888', fontSize: '18px' }}>We run 50+ simulations to verify your financial runway before you resign.</p>
                                </div>
                                <div style={{ flex: 1.2, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <span>Safety Score</span>
                                        <span style={{ color: '#d7fe03' }}>94/100</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: '94%', height: '100%', background: '#d7fe03' }} />
                                    </div>
                                    <div style={{ marginTop: '30px', display: 'flex', gap: '10px', fontSize: '12px', color: '#888' }}>
                                        <CheckCircle size={14} color="#d7fe03" /> Runway verified
                                        <CheckCircle size={14} color="#d7fe03" /> Skills matched
                                    </div>
                                </div>
                            </div>

                            {/* Slide 2: Roadmap */}
                            <div style={{ flex: 1, padding: '40px', display: 'flex', gap: '40px', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: '#d7fe03', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Timeline Engine</div>
                                    <h2 style={{ fontSize: '40px', lineHeight: '1.1', marginBottom: '20px' }}>Visual timelines.</h2>
                                    <p style={{ color: '#888', fontSize: '18px' }}>Know exactly when you'll recover your salary and hit senior level.</p>
                                </div>
                                <div style={{ flex: 1.2 }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '200px' }}>
                                        {[20, 30, 45, 40, 60, 80, 100].map((h, i) => (
                                            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 6 ? '#d7fe03' : 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                                {i === 6 && <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>$140k</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Slide 3: Success */}
                            <div style={{ flex: 1, padding: '40px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: '#d7fe03', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Builder</div>
                                    <h2 style={{ fontSize: '40px', lineHeight: '1.1', marginBottom: '20px' }}>You, packaged.</h2>
                                    <p style={{ color: '#888', fontSize: '18px' }}>Resumes, cover letters, and outreach messages generated to bypass ATS.</p>
                                </div>
                                <div style={{ flex: 1.2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- Page ---

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>

            {/* Hero */}
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(215, 254, 3, 0.08) 0%, rgba(0,0,0,0) 60%)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ zIndex: 1, textAlign: 'center' }}
                >
                    <h1 style={{ fontSize: 'clamp(80px, 15vw, 240px)', fontWeight: '500', lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '20px' }}>
                        switch.
                    </h1>
                    <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 40px' }}>
                        The conservative career strategist for the risk-averse.
                    </p>
                    <Button onClick={() => navigate('/diagnosis')} style={{ padding: '16px 48px', fontSize: '1.2rem', borderRadius: '100px', background: '#d7fe03', color: '#000', fontWeight: '600', marginBottom: '60px' }}>
                        Start Diagnosis
                    </Button>

                    <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '80px' }}>
                        <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
                            Trusted by professionals from
                        </p>
                        <Ticker items={[
                            "Marketing → Product", "Sales → Tech", "Consulting → Strategy",
                            "Teaching → EdTech", "Finance → Fintech", "Retail → E-commerce"
                        ]} speed={30} />
                    </div>
                </motion.div>
            </section>

            {/* Scroll Interaction */}
            <TabletScroll />

            {/* Bento Grid */}
            <Section style={{ position: 'relative', zIndex: 10, background: '#000', paddingBottom: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '60px', fontWeight: '600', letterSpacing: '-0.04em', color: '#fff' }}>Everything you need<br />to make the jump.</h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Large Card */}
                    <BentoCard
                        title="Salary Bridge"
                        subtitle="Visualize your income dip and recovery timeline."
                        icon={TrendingUp}
                        className="col-span-1 md:col-span-2"
                        style={{ gridColumn: 'span 2', minHeight: '400px' }}
                    >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '4px', paddingBottom: '20px' }}>
                            {/* Bars */}
                            {[40, 60, 50, 45, 70, 85, 95, 110, 120].map((h, i) => (
                                <div key={i} style={{ width: '8%', height: `${h * 0.6}%`, background: i < 3 ? 'rgba(255,255,255,0.2)' : (i < 5 ? '#ff5f57' : '#d7fe03'), borderRadius: '4px 4px 0 0' }} />
                            ))}
                        </div>
                    </BentoCard>

                    {/* Small Cards */}
                    <BentoCard title="Career Guard" icon={Shield} style={{ minHeight: '300px' }}>
                        <div style={{ fontSize: '60px', fontWeight: '700', color: '#fff', marginTop: '20px' }}>99.9%</div>
                        <div style={{ color: '#888' }}>Uptime for your career security. We preserve your optionality.</div>
                    </BentoCard>

                    <BentoCard title="Market Pulse" icon={Activity} style={{ minHeight: '300px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                            {['React Dev', 'Product Mgr', 'Data Lead'].map((role, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <span style={{ color: '#ccc' }}>{role}</span>
                                    <span style={{ color: '#d7fe03' }}>+12%</span>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    <BentoCard title="Private & Secure" icon={Lock} style={{ minHeight: '300px' }}>
                        <p style={{ color: '#888', lineHeight: '1.6' }}>
                            Your data never leaves our encrypted enclave. We don't sell to recruiters. You explore in stealth mode.
                        </p>
                    </BentoCard>

                    <BentoCard title="Instant Action" icon={Zap} style={{ minHeight: '300px', gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Button onClick={() => navigate('/diagnosis')} style={{ background: '#333', border: '1px solid #555' }}>
                                Assess My Profile <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                            </Button>
                        </div>
                    </BentoCard>
                </div>
            </Section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #222', padding: '80px 20px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>switch.</div>
                <p>&copy; 2026. Built by Colin.</p>
            </footer>
        </div>
    );
};

export default Home;
