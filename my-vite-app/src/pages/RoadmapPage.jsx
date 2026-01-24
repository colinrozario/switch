import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { endpoints } from '../api/endpoints';
import useStore from '../store/useStore';
import Card from '../components/UI/Card';

const RoadmapPage = () => {
    const { profileId, selectedOption, currentPlan, setCurrentPlan } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [horizon, setHorizon] = useState('1y');

    useEffect(() => {
        if (!selectedOption || !profileId) {
            navigate('/options');
        }
    }, [selectedOption, profileId]);

    const generateRoadmap = async (h) => {
        setLoading(true);
        setHorizon(h);
        try {
            const data = await endpoints.buildPlan(profileId, selectedOption.title, h);
            setCurrentPlan(data.roadmap); // PlanResponse has roadmap object inside
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on first load
    useEffect(() => {
        if (selectedOption && !currentPlan) {
            generateRoadmap('1y');
        }
    }, []);

    if (loading || !currentPlan) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Building your {horizon} plan...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '100px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{selectedOption.title} Roadmap</h1>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                    {['6m', '1y', '2y'].map(h => (
                        <button
                            key={h}
                            onClick={() => generateRoadmap(h)}
                            style={{
                                padding: '10px 30px',
                                borderRadius: '30px',
                                backgroundColor: horizon === h ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                color: horizon === h ? '#000' : '#fff',
                                fontWeight: '700'
                            }}
                        >
                            {h === '6m' ? 'Fast' : h === '1y' ? 'Balanced' : 'Safe'} ({h})
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', paddingLeft: '40px' }}>
                    {/* Vertical Line */}
                    <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: '2px', background: 'var(--color-border)' }} />

                    {currentPlan.roadmap.roadmap.map((phase, index) => (
                        <div key={index} style={{ marginBottom: '60px', position: 'relative' }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-33px',
                                top: '0',
                                width: '16px',
                                height: '16px',
                                background: 'var(--color-primary)',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px var(--color-primary)'
                            }} />

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{phase.name}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                                Duration: {phase.duration_weeks} weeks • {phase.objective}
                            </p>

                            <Card style={{ padding: '30px' }}>
                                <ul style={{ listStyle: 'none' }}>
                                    {phase.actions.map((action, i) => (
                                        <li key={i} style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <span style={{ color: 'var(--color-primary)' }}>▹</span>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default RoadmapPage;
