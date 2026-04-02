import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { getMockPaths } from '../services/mockData';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Paths = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPath, setSelectedPath] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setPaths(getMockPaths());
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', minHeight: '60vh'
            }}>
                <div style={{
                    width: '64px', height: '64px',
                    border: '4px solid var(--color-surface)',
                    borderTop: '4px solid var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Analyzing your profile...</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Calculating transition risks and salary bridges.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px', textAlign: 'center' }}
            >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Likely Feasible Paths</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Based on your constraints, these 3 roles maximize safety and income continuity.</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
                flex: 1
            }}>
                {paths.map((path, index) => (
                    <Card
                        key={path.id}
                        onClick={() => setSelectedPath(path)}
                        style={{
                            border: selectedPath?.id === path.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '320px'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                            <div style={{
                                display: 'inline-block', padding: '4px 12px', borderRadius: '99px',
                                fontSize: '12px', fontWeight: 'bold', marginBottom: '16px',
                                width: 'fit-content',
                                background: 'rgba(255,255,255,0.1)', // Simplification of risk color
                                color: '#FFF'
                            }}>
                                {path.riskLabel}
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{path.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                {path.matchParams.map((param, i) => (
                                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        • {param}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', flex: 1, lineHeight: '1.5' }}>
                                {path.description}
                            </p>

                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '12px',
                                borderRadius: '12px',
                                marginTop: 'auto'
                            }}>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Estimated Bridge</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '600' }}>{path.salaryBridge}</div>
                            </div>
                        </motion.div>

                        {selectedPath?.id === path.id && (
                            <div style={{
                                position: 'absolute', top: '-10px', right: '-10px',
                                background: 'var(--color-primary)', color: '#000',
                                borderRadius: '50%', padding: '4px'
                            }}>
                                <CheckCircle size={20} />
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <Button
                    disabled={!selectedPath}
                    onClick={() => navigate('/roadmap')}
                >
                    Generate Roadmap for {selectedPath ? selectedPath.title : '...'}
                </Button>
            </div>
        </div>
    );
};

export default Paths;
