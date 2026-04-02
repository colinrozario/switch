import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ProgressBar from '../components/UI/ProgressBar';
import { ArrowRight, ArrowLeft, DollarSign, Briefcase, AlertCircle } from 'lucide-react';

const Intake = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        currentRole: '',
        yearsExperience: '',
        context: '',
        monthlyIncome: '',
        monthlyExpenses: '',
        savings: '',
        targetRole: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    // In a real app, this would process data with AI
    const handleSubmit = () => {
        // Simulate processing delay then go to paths
        navigate('/paths');
    };

    return (
        <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Let's build your safety net.</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>We need a few details to model your transition risk accurately.</p>
            </motion.div>

            <ProgressBar current={step} total={totalSteps} />

            <div style={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Step 1: Current Situation</h3>
                            <Input
                                label="Current Role"
                                name="currentRole"
                                value={formData.currentRole}
                                onChange={handleChange}
                                placeholder="e.g. Senior Marketing Manager"
                                icon={Briefcase}
                            />
                            <Input
                                label="Years of Experience"
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleChange}
                                placeholder="e.g. 8"
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Why do you want to switch? (Be honest)</label>
                                <textarea
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
                                        color: '#FFF', fontSize: '16px', outline: 'none', resize: 'none', height: '128px'
                                    }}
                                    placeholder="I feel stuck, the industry is shrinking, and I want to move into Tech..."
                                    name="context"
                                    value={formData.context}
                                    onChange={handleChange}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Step 2: The Financials (Deterministic Models)</h3>
                            <div style={{
                                background: 'rgba(215, 254, 3, 0.1)', padding: '16px', borderRadius: '12px',
                                display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--color-primary)'
                            }}>
                                <AlertCircle size={20} style={{ minWidth: '20px' }} />
                                <p>We use these numbers to calculate your exact runway and failure threshold. We do not store this data.</p>
                            </div>
                            <Input
                                label="Monthly Net Income"
                                name="monthlyIncome"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                                placeholder="e.g. 5000"
                                icon={DollarSign}
                            />
                            <Input
                                label="Monthly Expenses (Burn Rate)"
                                name="monthlyExpenses"
                                value={formData.monthlyExpenses}
                                onChange={handleChange}
                                placeholder="e.g. 3000"
                                icon={DollarSign}
                            />
                            <Input
                                label="Liquid Savings"
                                name="savings"
                                value={formData.savings}
                                onChange={handleChange}
                                placeholder="e.g. 20000"
                                icon={DollarSign}
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Step 3: Target Direction</h3>
                            <Input
                                label="Target Role / Industry (Optional)"
                                name="targetRole"
                                value={formData.targetRole}
                                onChange={handleChange}
                                placeholder="e.g. Product Management, or 'I don't know yet'"
                            />
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                                If you don't have a target, our AI will suggest 3 feasible paths based on your current skills and risk profile.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
                {step > 1 ? (
                    <Button variant="ghost" onClick={prevStep}>
                        <ArrowLeft size={16} /> Back
                    </Button>
                ) : <div></div>}

                {step < totalSteps ? (
                    <Button onClick={nextStep}>
                        Continue <ArrowRight size={16} />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        Generate Paths <ArrowRight size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Intake;
