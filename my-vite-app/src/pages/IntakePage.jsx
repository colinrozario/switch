import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { endpoints } from '../api/endpoints';
import useStore from '../store/useStore';
import Card from '../components/UI/Card';

const IntakePage = () => {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const setProfileId = useStore((state) => state.setProfileId);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        try {
            const response = await endpoints.createProfile(inputText);
            setProfileId(response.id);
            navigate('/options');
        } catch (error) {
            console.error(error);
            alert("Failed to analyze profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '120px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    fontSize: '4rem',
                    marginBottom: '40px',
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #fff, #aaa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Transition<br />With Confidence
            </motion.h1>

            <Card className="intake-card" style={{ maxWidth: '800px', width: '100%' }}>
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Tell us about yourself</h3>
                <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
                    Paste your resume, LinkedIn bio, or just describe your current situation and goals.
                </p>

                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="I am a Senior Marketing Manager with 10 years experience looking to switch into Product Management..."
                    style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        padding: '20px',
                        fontSize: '1rem',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '30px'
                    }}
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#000',
                        padding: '16px 32px',
                        borderRadius: 'var(--radius-pill)',
                        fontWeight: '700',
                        fontSize: '1.2rem',
                        width: '100%',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Analyzing...' : 'Analyze Profile'}
                </motion.button>
            </Card>
        </div>
    );
};

export default IntakePage;
