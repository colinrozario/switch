import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Target, Clock, DollarSign, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import ProgressBar from '../components/UI/ProgressBar';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';

const steps = [
    { title: "Hello", description: "Getting Started" },
    { title: "Work", description: "Current Job" },
    { title: "Time", description: "Your Schedule" },
    { title: "Money", description: "Savings & Costs" },
    { title: "Goals", description: "What's Next?" },
    { title: "Check", description: "Review" },
    { title: "Results", description: "Analysis" }
];

const DiagnosisPage = () => {
    const navigate = useNavigate();
    const { diagnosis, updateDiagnosis, setDiagnosis, setProfileId } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [localData, setLocalData] = useState(diagnosis);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleChange = (section, field, value) => {
        const updated = { ...localData };
        if (section) {
            updated[section][field] = value;
        } else {
            updated[field] = value;
        }
        setLocalData(updated);
        updateDiagnosis(section || field, section ? updated[section] : value);
    };

    const handleAnalysis = async () => {
        setIsAnalyzing(true);
        setCurrentStep(6); // Analysis screen

        const rawText = `
            PROFILE SNAPSHOT:
            Role: ${localData.currentRole}
            Experience: ${localData.yearsExperience} years
            Industry: ${localData.industry || "Not Specified"}
            
            CONSTRAINTS:
            Weekly Time: ${localData.constraints.hours}
            Location: ${localData.constraints.location}
            Dependents: ${localData.constraints.dependents}
            
            FINANCIAL RUNWAY:
            Monthly Burn: ₹${localData.financials.expenses}
            Liquid Savings: ₹${localData.financials.savings}
            Stable Income: ${localData.financials.hasStableIncome ? "Yes" : "No"}
            
            OBJECTIVE:
            Goal Type: ${localData.goal.type}
            Target Role: ${localData.goal.targetRole || "To be explored"}
            Motivations: ${localData.goal.motivations.join(", ")}
        `;

        try {
            const response = await endpoints.createIntake(rawText);
            setProfileId(response.result_ref);
            // Persist full localData snapshot so ProfileReviewPage can read it from store
            setDiagnosis(localData);
            
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (error) {
            console.error("Analysis Error:", error);
            setIsAnalyzing(false);
            setCurrentStep(5);
            alert("Something went wrong with the analysis. Please try again.");
        }
    };

    const variants = {
        enter: { opacity: 0, x: 10 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#F8FAFC', 
            paddingTop: '120px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            paddingBottom: '80px'
        }}>
            {/* Header / Progress */}
            <div style={{ width: '100%', maxWidth: '700px', marginBottom: '40px', padding: '0 24px' }}>
                <ProgressBar 
                    current={currentStep + 1} 
                    total={steps.length} 
                    label={steps[currentStep].title} 
                />
            </div>

            <Card padding="48px" style={{ width: '100%', maxWidth: '700px', minHeight: '500px', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
                <AnimatePresence mode='wait'>
                    {currentStep === 0 && (
                        <motion.div key="step0" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <div style={{ width: '56px', height: '56px', background: '#F1F5F9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', color: 'var(--color-text)' }}>
                                <Shield size={28} />
                            </div>
                            <h2 style={{ fontSize: '32px', marginBottom: '20px', letterSpacing: '-0.02em' }}>Your Career Checkup</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '18px', lineHeight: 1.5 }}>
                                Let's map out your current situation. We'll look at your work history, your savings, and how much time you have to invest in your next move.
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
                                <div style={{ padding: '16px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text)', marginBottom: '4px' }}>Real Data</div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>No guesswork. Just the facts about your path.</div>
                                </div>
                                <div style={{ padding: '16px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text)', marginBottom: '4px' }}>Private & Secure</div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Your data stays safe and secure with us.</div>
                                </div>
                            </div>
                            
                            <Button onClick={nextStep} size="lg" style={{ width: '100%' }}>
                                Start My Checkup <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                            </Button>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', marginBottom: '32px', letterSpacing: '-0.02em' }}>Your Current Job</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <Input 
                                    label="What's your current job title?"
                                    value={localData.currentRole}
                                    onChange={(e) => handleChange(null, 'currentRole', e.target.value)}
                                    placeholder="e.g. Sales Manager"
                                    icon={Target}
                                    required
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Years of Experience</span>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-accent)' }}>{localData.yearsExperience}y</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="25"
                                        value={localData.yearsExperience}
                                        onChange={(e) => handleChange(null, 'yearsExperience', e.target.value)}
                                        style={{ 
                                            width: '100%', 
                                            height: '6px', 
                                            borderRadius: '99px',
                                            accentColor: 'var(--color-accent)',
                                            background: '#E2E8F0',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '48px' }}>
                                <Button variant="outline" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} disabled={!localData.currentRole} style={{ flex: 1 }}>Continue</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', marginBottom: '32px', letterSpacing: '-0.02em' }}>Your Schedule</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>How many hours can you put in per week?</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        {['3-5', '5-10', '10-20', '20+'].map(hrs => (
                                            <div 
                                                key={hrs}
                                                onClick={() => handleChange('constraints', 'hours', hrs)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1.5px solid',
                                                    borderColor: localData.constraints.hours === hrs ? 'var(--color-accent)' : 'var(--color-border)',
                                                    background: localData.constraints.hours === hrs ? 'var(--color-surface)' : 'transparent',
                                                    color: localData.constraints.hours === hrs ? 'var(--color-accent)' : 'inherit',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {hrs} hrs/wk
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Preferred work style</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                        {['Flexible', 'Hybrid', 'On-site'].map(fmt => (
                                            <div 
                                                key={fmt}
                                                onClick={() => handleChange('constraints', 'location', fmt)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1.5px solid',
                                                    borderColor: localData.constraints.location === fmt ? 'var(--color-accent)' : 'var(--color-border)',
                                                    background: localData.constraints.location === fmt ? 'var(--color-surface)' : 'transparent',
                                                    color: localData.constraints.location === fmt ? 'var(--color-accent)' : 'inherit',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {fmt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '48px' }}>
                                <Button variant="outline" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} style={{ flex: 1 }}>Continue</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', marginBottom: '12px', letterSpacing: '-0.02em' }}>Savings & Costs</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
                                We use these numbers to see how much time you have to make your move safely.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <Input 
                                    label="Monthly Living Expenses (₹)"
                                    type="number"
                                    value={localData.financials.expenses}
                                    onChange={(e) => handleChange('financials', 'expenses', e.target.value)}
                                    placeholder="e.g. 3500"
                                    icon={Clock}
                                    required
                                />

                                <Input 
                                    label="Total Savings Available (₹)"
                                    type="number"
                                    value={localData.financials.savings}
                                    onChange={(e) => handleChange('financials', 'savings', e.target.value)}
                                    placeholder="e.g. 24000"
                                    icon={DollarSign}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '48px' }}>
                                <Button variant="outline" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} style={{ flex: 1 }}>Continue</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', marginBottom: '32px', letterSpacing: '-0.02em' }}>What's Your Goal?</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['Searching', 'Specific'].map(type => (
                                        <div 
                                            key={type}
                                            onClick={() => handleChange('goal', 'type', type.toLowerCase())}
                                            style={{
                                                flex: 1,
                                                padding: '16px',
                                                borderRadius: '12px',
                                                border: '1.5px solid',
                                                borderColor: localData.goal.type === type.toLowerCase() ? 'var(--color-accent)' : 'var(--color-border)',
                                                background: localData.goal.type === type.toLowerCase() ? 'var(--color-surface)' : 'transparent',
                                                color: localData.goal.type === type.toLowerCase() ? 'var(--color-accent)' : 'inherit',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontWeight: '800', fontSize: '15px' }}>{type === 'Searching' ? "I'm Exploring" : "I have a goal"}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', fontWeight: '500' }}>
                                                {type === 'Searching' ? 'Find the best paths' : 'Have a target role'}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {localData.goal.type === 'specific' && (
                                    <Input 
                                        label="What role are you aiming for?"
                                        value={localData.goal.targetRole}
                                        onChange={(e) => handleChange('goal', 'targetRole', e.target.value)}
                                        placeholder="e.g. Product Manager"
                                        icon={Activity}
                                        required
                                    />
                                )}

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {['Better Pay', 'More Freedom', 'Less Stress', 'New Skills', 'Work from Home'].map(tag => (
                                        <div 
                                            key={tag}
                                            onClick={() => {
                                                const current = localData.goal.motivations;
                                                const updated = current.includes(tag) 
                                                    ? current.filter(t => t !== tag) 
                                                    : [...current, tag];
                                                handleChange('goal', 'motivations', updated);
                                            }}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '99px',
                                                background: localData.goal.motivations.includes(tag) ? 'var(--color-accent)' : 'var(--color-surface)',
                                                color: localData.goal.motivations.includes(tag) ? '#FFFFFF' : 'var(--color-text-secondary)',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                border: '1px solid var(--color-border)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '48px' }}>
                                <Button variant="outline" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} style={{ flex: 1 }}>Review & Finish</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 5 && (
                        <motion.div key="step5" variants={variants} initial="enter" animate="center" exit="exit" style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '28px', marginBottom: '8px', letterSpacing: '-0.02em' }}>One Last Look</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
                                Make sure everything looks right before we start the analysis.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Current Job:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '800' }}>{localData.currentRole}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Time/Week:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '800' }}>{localData.constraints.hours} hrs</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Monthly Costs:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '800' }}>₹{localData.financials.expenses}/mo</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Your Goal:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-accent)' }}>{localData.goal.type === 'specific' ? localData.goal.targetRole : 'Exploring'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '48px' }}>
                                <Button variant="outline" onClick={prevStep}>Edit</Button>
                                <Button onClick={handleAnalysis} style={{ flex: 1 }}>Start the Analysis</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 6 && (
                        <motion.div key="step6" variants={variants} initial="enter" animate="center" exit="exit" style={{ 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{ position: 'relative', marginBottom: '40px' }}>
                                <div style={{ position: 'absolute', inset: -20, background: 'var(--color-surface)', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.5 }} />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                >
                                    <Activity size={64} style={{ color: 'var(--color-text)' }} />
                                </motion.div>
                            </div>
                            
                            <h2 style={{ fontSize: '24px', marginBottom: '16px', letterSpacing: '-0.02em' }}>Calculating Your Best Moves</h2>
                            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '450px', lineHeight: 1.6, fontSize: '15px' }}>
                                We're checking thousands of possibilities to find your safest and fastest path forward. Just a second...
                            </p>
                            
                            <div style={{ marginTop: '48px', width: '240px' }}>
                                <div style={{ height: '4px', background: 'var(--color-surface)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 3, ease: 'easeInOut' }}
                                        style={{ height: '100%', background: 'var(--color-accent)' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default DiagnosisPage;
