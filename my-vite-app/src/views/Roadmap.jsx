import React from 'react';
import { motion } from 'framer-motion';
import { getMockPaths } from '../services/mockData';
import Button from '../components/UI/Button';
import { Download, Calendar, DollarSign, CheckSquare } from 'lucide-react';
import Card from '../components/UI/Card';

const Roadmap = () => {
    // Ideally we pass the selected ID via context/url, for MVP we just show the first one
    const path = getMockPaths()[0];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Target Role</div>
                    <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: 1 }}>{path.title}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: '18px' }}>{path.description}</p>
                </div>
                <div style={{
                    textAlign: 'right', display: 'none', // md:block logic can be done with media queries, simplifying to always show or hide on small. I'll just show it.
                }}>
                    {/* Hidden on mobile for simplicity in inline styles without window hooks */}
                </div>
            </motion.div>

            {/* Timeline */}
            <div style={{
                position: 'relative',
                borderLeft: '2px solid var(--color-border)',
                paddingLeft: '32px',
                marginLeft: '16px',
                paddingBottom: '48px'
            }}>
                {path.roadmap.map((phase, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        style={{ position: 'relative', marginBottom: '48px' }}
                    >
                        {/* Dot */}
                        <div style={{
                            position: 'absolute',
                            left: '-43px', // -32 padding - 2 border - 9 (half width)
                            top: '0',
                            width: '20px',
                            height: '20px',
                            background: index === 0 ? 'var(--color-primary)' : 'var(--color-bg)',
                            borderRadius: '50%',
                            border: `4px solid var(--color-border)`
                        }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{phase.phase}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                                    <Calendar size={14} /> {phase.duration}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {phase.milestones.map((ms, i) => (
                                        <Card key={i} style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--color-surface)', backdropFilter: 'none' }}>
                                            <CheckSquare size={18} style={{ color: 'var(--color-primary)', minWidth: '18px' }} />
                                            <span style={{ fontSize: '15px', lineHeight: '1.4' }}>{ms}</span>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <div style={{
                                    background: 'rgba(215, 254, 3, 0.1)', // Primary Low Opacity
                                    padding: '24px',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(215, 254, 3, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                        <DollarSign size={14} /> Financial Impact
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#FFF' }}>{phase.financialImpact}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center' }}>
                <Button>
                    Export Full Strategic Plan (PDF)
                </Button>
            </div>
        </div>
    );
};

export default Roadmap;
