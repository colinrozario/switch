import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { endpoints } from '../api/endpoints';
import useStore from '../store/useStore';
import Card from '../components/UI/Card';

const OptionsPage = () => {
    const { profileId, careerOptions, setCareerOptions, setSelectedOption, setProfileId } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirection safety
        if (!profileId) {
            navigate('/intake');
            return;
        }

        const fetchOptions = async () => {
            try {
                const data = await endpoints.getCareerOptions(profileId);
                setCareerOptions(data);
            } catch (error) {
                console.error("Failed to fetch options", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [profileId]);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        navigate('/roadmap');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Generating Paths...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '100px 20px' }}>
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px' }}
            >
                We found {careerOptions.length} paths for you
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                {careerOptions.map((option, index) => (
                    <Card key={index} onClick={() => handleSelectOption(option)}>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{option.title}</h3>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <Badge label={`Feasibility: ${Math.round(option.feasibility_score)}%`} color={option.feasibility_score > 70 ? '#4caf50' : '#ff9800'} />
                            <Badge label={`${option.salary_delta_p25 > 0 ? '+' : ''}$${Math.round(option.salary_delta_p25).toLocaleString()}`} color="var(--color-primary)" />
                        </div>

                        {option.ai_explanation && (
                            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#ddd', marginBottom: '10px' }}>
                                    <strong>Why:</strong> {option.ai_explanation.why_this_fits || "Great fit for your skills."}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#ffaaaa' }}>
                                    <strong>Risk:</strong> {option.ai_explanation.risk_analysis || "Moderate risk."}
                                </p>
                            </div>
                        )}

                        <div style={{ marginTop: '30px', textAlign: 'right', color: 'var(--color-primary)', fontWeight: '600' }}>
                            Explore Plan →
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const Badge = ({ label, color }) => (
    <span style={{
        backgroundColor: color,
        color: '#000',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '700',
        display: 'inline-block'
    }}>
        {label}
    </span>
);

export default OptionsPage;
