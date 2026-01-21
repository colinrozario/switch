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
        <div className="w-full max-w-2xl mx-auto flex flex-col justify-center h-full py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold mb-2">Let's build your safety net.</h2>
                <p className="text-gray-500">We need a few details to model your transition risk accurately.</p>
            </motion.div>

            <ProgressBar current={step} total={totalSteps} />

            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-4"
                        >
                            <h3 className="text-xl font-semibold mb-2">Step 1: Current Situation</h3>
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
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Why do you want to switch? (Be honest)</label>
                                <textarea
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-1 focus:ring-black outline-none resize-none h-32"
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
                            className="flex flex-col gap-4"
                        >
                            <h3 className="text-xl font-semibold mb-2">Step 2: The Financials (Deterministic Models)</h3>
                            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 mb-2">
                                <AlertCircle size={20} />
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
                            className="flex flex-col gap-4"
                        >
                            <h3 className="text-xl font-semibold mb-2">Step 3: Target Direction</h3>
                            <Input
                                label="Target Role / Industry (Optional)"
                                name="targetRole"
                                value={formData.targetRole}
                                onChange={handleChange}
                                placeholder="e.g. Product Management, or 'I don't know yet'"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                If you don't have a target, our AI will suggest 3 feasible paths based on your current skills and risk profile.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
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
