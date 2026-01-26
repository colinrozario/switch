import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/UI/Button';
import Section from '../components/Layout/Section';
import Ticker from '../components/UI/Ticker';
import { TrendingUp, Activity, Shield, CheckCircle, ArrowRight, Lock, Zap, Home as HomeIcon, PieChart, Map, User, Menu } from 'lucide-react';

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

// --- Realistic Tablet UI Components ---

const Sidebar = () => (
    <div style={{
        width: '80px',
        height: '100%',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '30px',
        gap: '40px'
    }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#d7fe03' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <HomeIcon size={24} color="#fff" />
            <PieChart size={24} color="#666" />
            <Map size={24} color="#666" />
            <User size={24} color="#666" />
        </div>
    </div>
);

const AppHeader = ({ title }) => (
    <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Good Morning, Alex</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>{title}</div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '8px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px' }}>Draft Mode</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333' }} />
        </div>
    </div>
);

// --- 3D Tablet Component ---

const TabletScroll = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 1. Entry Animation (Tilt Up + Fade In)
    const rotateX = useTransform(scrollYProgress, [0.1, 0.3], [40, 0]);
    // FIXED: Removed scale down. Kept constant scale.
    const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);

    // 2. Horizontal Swipe Logic (0% to -50% for 2 slides)
    // Locked phase: 0.3 to 0.7
    const contentX = useTransform(scrollYProgress, [0.35, 0.65], ['0%', '-50%']);

    return (
        // FIXED: Reduced height to remove blank space
        <div ref={containerRef} style={{ height: '250vh', position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '1200px' }}>
                <motion.div
                    style={{
                        width: '900px', // Landscape Tablet Width
                        height: '640px', // Landscape Tablet Height
                        background: '#0a0a0a',
                        borderRadius: '32px',
                        border: '12px solid #222', // Thicker bezel
                        boxShadow: '0 50px 150px -20px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1)',
                        position: 'relative',
                        rotateX,
                        scale,
                        opacity,
                        y,
                        // overflow: 'hidden' // Removed to show buttons outside
                    }}
                >
                    {/* Hardware Buttons */}
                    <div style={{ position: 'absolute', top: '60px', right: '-16px', width: '4px', height: '40px', background: '#333', borderRadius: '0 4px 4px 0' }} /> {/* Volume Up */}
                    <div style={{ position: 'absolute', top: '110px', right: '-16px', width: '4px', height: '40px', background: '#333', borderRadius: '0 4px 4px 0' }} /> {/* Volume Down */}
                    <div style={{ position: 'absolute', top: '40px', left: '-16px', width: '4px', height: '30px', background: '#333', borderRadius: '4px 0 0 4px' }} /> {/* Power */}

                    {/* Camera Dot */}
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }} />

                    {/* Screen Glare / Gloss */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 40%)', pointerEvents: 'none', zIndex: 30 }} />

                    {/* App Content Container (Horizontal Row) */}
                    <motion.div style={{
                        height: '100%',
                        width: '200%', // 2 Slides
                        display: 'flex',
                        x: contentX,
                        borderRadius: '20px', // Inner radius matching frame
                        overflow: 'hidden'
                    }}>

                        {/* SCREEN 1: DASHBOARD (Landscape Layout) */}
                        <div style={{ width: '50%', height: '100%', background: '#0a0a0a', display: 'flex' }}>
                            <Sidebar />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <AppHeader title="Financial Overview" />
                                <div style={{ padding: '0 32px 32px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', height: '100%' }}>

                                    {/* Main Chart Card */}
                                    <div style={{ background: '#1c1c1c', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#888' }}>Runway Projection</div>
                                                <div style={{ fontSize: '32px', fontWeight: '600', color: '#fff' }}>18 Months</div>
                                            </div>
                                            <div style={{ padding: '8px 16px', background: 'rgba(215, 254, 3, 0.1)', color: '#d7fe03', borderRadius: '8px', height: 'fit-content' }}>Safe</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                                            {[40, 38, 36, 34, 32, 30, 28, 60, 65, 70, 75, 80].map((h, i) => (
                                                <div key={i} style={{
                                                    flex: 1,
                                                    height: `${h}%`,
                                                    background: i > 6 ? '#d7fe03' : 'rgba(255,255,255,0.1)',
                                                    borderRadius: '4px'
                                                }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Side Stats */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div style={{ background: '#1c1c1c', borderRadius: '24px', padding: '24px', flex: 1 }}>
                                            <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>Switch Score</div>
                                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>94</div>
                                            <div style={{ height: '6px', background: '#333', borderRadius: '100px', marginTop: '16px', overflow: 'hidden' }}>
                                                <div style={{ width: '94%', height: '100%', background: '#d7fe03' }} />
                                            </div>
                                        </div>
                                        <div style={{ background: '#1c1c1c', borderRadius: '24px', padding: '24px', flex: 1 }}>
                                            <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>Savings Buffer</div>
                                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>$24k</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>+ $2k this month</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* SCREEN 2: ROADMAP (Landscape Layout) */}
                        <div style={{ width: '50%', height: '100%', background: '#0a0a0a', display: 'flex' }}>
                            <Sidebar />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <AppHeader title="Transition Roadmap" />
                                <div style={{ padding: '0 32px 32px 32px', display: 'flex', gap: '32px', height: '100%' }}>

                                    {/* Gantt / Timeline Area */}
                                    <div style={{ flex: 2, background: '#1c1c1c', borderRadius: '24px', padding: '32px' }}>
                                        <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phase 1: Validation</div>

                                        {[
                                            { week: "Week 1", task: "Market Research & Gaps", status: "Done" },
                                            { week: "Week 2", task: "Resume Asset Generation", status: "In Progress" },
                                            { week: "Week 3", task: "Outreach Campaign (10)", status: "Pending" },
                                            { week: "Week 4", task: "First Interview Loop", status: "Locked" },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', opacity: i > 2 ? 0.3 : 1 }}>
                                                <div style={{ width: '80px', fontSize: '14px', color: '#666' }}>{item.week}</div>
                                                <div style={{ flex: 1, height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px', borderLeft: i === 1 ? '4px solid #d7fe03' : '4px solid transparent' }}>
                                                    <span style={{ color: '#fff', fontSize: '14px' }}>{item.task}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Panel */}
                                    <div style={{ flex: 1, background: 'rgba(215, 254, 3, 0.05)', borderRadius: '24px', padding: '32px', border: '1px solid #d7fe03' }}>
                                        <div style={{ fontSize: '12px', color: '#d7fe03', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px' }}>Current Focus</div>
                                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Resume Update</h3>
                                        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
                                            Your resume needs to highlight "Product Strategy" over "Marketing Campaigns" to pass the ATS.
                                        </p>
                                        <button style={{ width: '100%', padding: '16px', background: '#d7fe03', color: '#000', fontWeight: '600', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                                            Auto-Fix Resume
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </motion.div>
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
                    style={{ zIndex: 1, textAlign: 'center', padding: '0 20px' }}
                >
                    <h1 style={{ fontSize: 'clamp(60px, 12vw, 180px)', fontWeight: '500', lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '20px' }}>
                        switch.
                    </h1>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 40px' }}>
                        The conservative career strategist for the risk-averse.
                    </p>
                    <Button onClick={() => navigate('/diagnosis')} style={{ padding: '16px 48px', fontSize: '1.2rem', borderRadius: '100px', background: '#d7fe03', color: '#000', fontWeight: '600', marginBottom: '60px' }}>
                        Start Diagnosis
                    </Button>

                    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto 80px auto' }}>
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

            {/* Scroll Interaction - Landscape Tablet */}
            <TabletScroll />

            {/* How It Works Section */}
            <Section style={{ background: '#080808', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '120px 5%' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.04em' }}>
                        The System
                    </h2>
                    <p style={{ fontSize: '20px', color: '#888', lineHeight: '1.6' }}>
                        We replaced "generic career advice" with a deterministic financial engine. Here is how we get you from A to B safely.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                    {[
                        {
                            step: "01",
                            title: "Input Reality",
                            desc: "We start with your hard constraints: current salary, liquid savings, and time availability (e.g. 5hrs/week).",
                            color: "#fff"
                        },
                        {
                            step: "02",
                            title: "Simulate Risk",
                            desc: "Our engine runs 1,000 Monte Carlo simulations to find the highest-ROI path that preserves your financial runway.",
                            color: "#d7fe03"
                        },
                        {
                            step: "03",
                            title: "Execute Plan",
                            desc: "You get a week-by-week roadmap. Every task is vetted for ROI. You don't waste a single minute on fluff.",
                            color: "#fff"
                        }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: item.color, border: `1px solid ${item.color}`, padding: '4px 12px', borderRadius: '100px', width: 'fit-content' }}>
                                STEP {item.step}
                            </div>
                            <h3 style={{ fontSize: '32px', fontWeight: '600' }}>{item.title}</h3>
                            <p style={{ color: '#888', lineHeight: '1.6', fontSize: '18px' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Comparison Section */}
            <Section style={{ padding: '120px 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* The Old Way */}
                    <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid #333' }}>
                        <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '30px' }}>Generic Career Advice</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                                <span style={{ color: '#ff5f57' }}>✕</span> "Just follow your passion"
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                                <span style={{ color: '#ff5f57' }}>✕</span> Ignoring financial runway
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                                <span style={{ color: '#ff5f57' }}>✕</span> Applying to 100s of jobs blindly
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                                <span style={{ color: '#ff5f57' }}>✕</span> Vague, overwhelming goals
                            </li>
                        </ul>
                    </div>

                    {/* The Switch Way */}
                    <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(215, 254, 3, 0.05)', border: '1px solid #d7fe03' }}>
                        <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '30px' }}>The switch. Protocol</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                                <span style={{ color: '#d7fe03' }}>✓</span> "Follow the market demand"
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                                <span style={{ color: '#d7fe03' }}>✓</span> Safety margin first
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                                <span style={{ color: '#d7fe03' }}>✓</span> Targeted networking & assets
                            </li>
                            <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                                <span style={{ color: '#d7fe03' }}>✓</span> Week-by-week execution plan
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Bento Grid */}
            <Section style={{ position: 'relative', zIndex: 10, background: '#000', paddingBottom: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: '600', letterSpacing: '-0.04em', color: '#fff' }}>Everything you need<br />to make the jump.</h2>
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
