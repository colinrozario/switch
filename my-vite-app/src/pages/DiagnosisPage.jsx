import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';

const steps = [
    "Context", "Snapshot", "Constraints", "Financials", "Goal", "Review", "Analysis"
];

const DiagnosisPage = () => {
    const navigate = useNavigate();
    const { diagnosis, updateDiagnosis, setProfileId } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [localData, setLocalData] = useState(diagnosis);

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
        setCurrentStep(6); // Analysis screen

        // Construct prompt for the existing intake parser
        const prompt = `
        Current Role: ${localData.currentRole}
        Experience: ${localData.yearsExperience} years
        Industry: ${localData.industry || "General"}
        
        Financials:
        - Monthly Expenses: $${localData.financials.expenses}
        - Savings: $${localData.financials.savings}
        - Stable Income: ${localData.financials.hasStableIncome}
        
        Constraints:
        - Location: ${localData.constraints.location}
        - Weekly Hours: ${localData.constraints.hours}
        - Dependents: ${localData.constraints.dependents}
        
        Goal:
        - Target: ${localData.goal.targetRole || "Unsure"}
        - Type: ${localData.goal.type}
        - Motivations: ${localData.goal.motivations.join(", ")}
        `;

        try {
            const response = await endpoints.createProfile(prompt);
            setProfileId(response.id);
            // Wait a bit to show the "Analysis" animation
            setTimeout(() => {
                navigate('/options');
            }, 2500);
        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
            setCurrentStep(5); // Go back
        }
    };

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <span>Step {currentStep}</span>
                    <span>{steps[currentStep]}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        style={{ height: '100%', background: 'var(--color-primary)' }}
                    />
                </div>
            </div>

            <Card style={{ width: '100%', maxWidth: '600px', minHeight: '400px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode='wait'>
                    {currentStep === 0 && (
                        <motion.div key="step0" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Before we plan.</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>
                                To maximize your safety margin, we need to understand your reality.
                            </p>
                            <ul style={{ marginBottom: '40px', color: '#fff', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                <li>○ Your professional experience</li>
                                <li>○ Real-life time constraints</li>
                                <li>○ Financial runway</li>
                            </ul>
                            <Button onClick={nextStep} style={{ width: '100%' }}>Start Diagnosis</Button>
                        </motion.div>
                    )}

                    {currentStep === 1 && (
                        <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Professional Snapshot</h2>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Current Role Title</span>
                                <input
                                    type="text"
                                    value={localData.currentRole}
                                    onChange={(e) => handleChange(null, 'currentRole', e.target.value)}
                                    placeholder="e.g. Senior Marketing Manager"
                                    style={inputStyle}
                                />
                            </label>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Years of Experience: {localData.yearsExperience}</span>
                                <input
                                    type="range"
                                    min="0" max="30"
                                    value={localData.yearsExperience}
                                    onChange={(e) => handleChange(null, 'yearsExperience', e.target.value)}
                                    style={{ width: '100%', marginTop: '10px', accentColor: 'var(--color-primary)' }}
                                />
                            </label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                                <Button variant="secondary" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} disabled={!localData.currentRole}>Next</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Real Constraints</h2>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Weekly Time Available</span>
                                <select
                                    value={localData.constraints.hours}
                                    onChange={(e) => handleChange('constraints', 'hours', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="3-5">3-5 hours (Tight)</option>
                                    <option value="5-10">5-10 hours (Moderate)</option>
                                    <option value="10-15">10-15 hours (Dedicated)</option>
                                    <option value="20+">20+ hours (Full focus)</option>
                                </select>
                            </label>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Location Flexibility</span>
                                <select
                                    value={localData.constraints.location}
                                    onChange={(e) => handleChange('constraints', 'location', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="Flexible">Flexible / Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="On-site">On-site Only</option>
                                </select>
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                                <Button variant="secondary" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep}>Next</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Financial Safety</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                                We use conservative estimates to prevent runway failure.
                            </p>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Monthly Expenses ($)</span>
                                <input
                                    type="number"
                                    value={localData.financials.expenses}
                                    onChange={(e) => handleChange('financials', 'expenses', e.target.value)}
                                    style={inputStyle}
                                />
                            </label>

                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Total Liquid Savings ($)</span>
                                <input
                                    type="number"
                                    value={localData.financials.savings}
                                    onChange={(e) => handleChange('financials', 'savings', e.target.value)}
                                    style={inputStyle}
                                />
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                                <Button variant="secondary" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep}>Next</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Goal Clarity</h2>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div
                                    onClick={() => handleChange('goal', 'type', 'target')}
                                    style={{ ...selectionCardStyle, borderColor: localData.goal.type === 'target' ? 'var(--color-primary)' : 'transparent' }}
                                >
                                    I have a specific role in mind
                                </div>
                                <div
                                    onClick={() => handleChange('goal', 'type', 'unsure')}
                                    style={{ ...selectionCardStyle, borderColor: localData.goal.type === 'unsure' ? 'var(--color-primary)' : 'transparent' }}
                                >
                                    I'm exploring options
                                </div>
                            </div>

                            {localData.goal.type === 'target' ? (
                                <label style={{ display: 'block', marginBottom: '20px' }}>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Target Role</span>
                                    <input
                                        type="text"
                                        value={localData.goal.targetRole}
                                        onChange={(e) => handleChange('goal', 'targetRole', e.target.value)}
                                        placeholder="e.g. Product Manager"
                                        style={inputStyle}
                                    />
                                </label>
                            ) : (
                                <label style={{ display: 'block', marginBottom: '20px' }}>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Key Motivations (Select multiple)</span>
                                    {/* Simplified for demo: just text */}
                                    <div style={{ color: '#888', fontStyle: 'italic', marginTop: '10px' }}>
                                        (Better Pay, Less Stress, Remote - AI will infer)
                                    </div>
                                </label>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                                <Button variant="secondary" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep}>Review Diagnosis</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 5 && (
                        <motion.div key="step5" variants={variants} initial="enter" animate="center" exit="exit">
                            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Confirm Situation</h2>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                                <div style={summaryRow}><span style={{ color: '#888' }}>Role:</span> <span>{localData.currentRole} ({localData.yearsExperience}y)</span></div>
                                <div style={summaryRow}><span style={{ color: '#888' }}>Runway:</span> <span>${localData.financials.savings} / ${localData.financials.expenses}mo</span></div>
                                <div style={summaryRow}><span style={{ color: '#888' }}>Constraint:</span> <span>{localData.constraints.hours} hrs/wk</span></div>
                                <div style={summaryRow}><span style={{ color: '#888' }}>Goal:</span> <span style={{ color: 'var(--color-primary)' }}>{localData.goal.type === 'target' ? localData.goal.targetRole : "Exploratory"}</span></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                                <Button variant="secondary" onClick={prevStep}>Edit</Button>
                                <Button onClick={handleAnalysis} style={{ width: '60%' }}>Run System Analysis</Button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 6 && (
                        <motion.div key="step6" variants={variants} initial="enter" animate="center" exit="exit" style={{ textAlign: 'center', paddingTop: '40px' }}>
                            <Activity size={60} style={{ color: 'var(--color-primary)', marginBottom: '30px' }} className="spin-slow" />
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Stress-testing your runway...</h2>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Simulating failure scenarios and mapping viable bridges.
                            </p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </Card>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333',
    borderRadius: '8px', color: '#fff', fontSize: '1rem', marginTop: '8px'
};

const selectionCardStyle = {
    flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
    border: '2px solid transparent', cursor: 'pointer', textAlign: 'center'
};

const summaryRow = {
    display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px'
};

export default DiagnosisPage;
