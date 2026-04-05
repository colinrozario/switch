import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleAlert, CheckCircle2, Save, FileEdit, Calculator, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const ProfileReviewPage = () => {
    const navigate = useNavigate();
    const { profileId } = useStore();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!profileId) {
            navigate('/diagnosis');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await endpoints.getIntake(profileId);
                setProfile(response.data);
                
                const structured = response.data.structured || {};
                setFormData({
                    current_role: structured.current_role || '',
                    years_experience: structured.years_experience || 0,
                    monthly_net_income: structured.monthly_net_income || 0,
                    monthly_expenses: structured.monthly_expenses || 0,
                    liquid_savings: structured.liquid_savings || 0,
                    weekly_hours_available: structured.weekly_hours_available || 0,
                    hard_constraints: Array.isArray(structured.hard_constraints) ? structured.hard_constraints : []
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await endpoints.updateIntake(profileId, formData);
            navigate('/options');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Oops! We couldn't save your changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Getting your profile ready...</h2>
            </div>
        );
    }

    const confidenceScores = profile?.confidence_scores || {};
    
    const financialFields = ['monthly_net_income', 'monthly_expenses', 'liquid_savings'];

    const getFieldStatus = (field) => {
        const val = formData[field];
        const isFinancial = financialFields.includes(field);
        
        // Red state: Missing financial data
        if (isFinancial && (val === 0 || val === '' || val === null || val === undefined)) {
            return { status: 'required', label: 'Required — please fill this in' };
        }
        
        // Yellow state: Inferred from AI with low confidence
        if ((confidenceScores[field] || 1) < 0.7) {
            return { status: 'inferred', label: 'We inferred this — please verify' };
        }
        
        return { status: null, label: null };
    };

    const isFormInvalid = financialFields.some(f => {
        const statusObj = getFieldStatus(f);
        return statusObj.status === 'required';
    });

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            background: '#FFFFFF', 
                            padding: '4px 12px', 
                            borderRadius: '99px', 
                            border: '1px solid var(--color-border)', 
                            color: 'var(--color-text-secondary)', 
                            fontSize: '12px', 
                            fontWeight: '700', 
                            marginBottom: '24px' 
                        }}>
                            STEP 2: PROFILE REVIEW
                        </div>
                        <h1 style={{ fontSize: '40px', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                            Here's what we understood — correct anything that looks off.
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', lineHeight: 1.5, maxWidth: '700px' }}>
                            This is the profile we built from your data. We've highlighted fields that we inferred or that still need your input before we can analyze your transition.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        {/* Section: Identity */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: 'var(--color-text)' }}>
                                    <User size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Job Details</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <Input 
                                    label="Current Job Title"
                                    value={formData.current_role}
                                    onChange={(e) => handleInputChange('current_role', e.target.value)}
                                    icon={FileEdit}
                                    {...getFieldStatus('current_role')}
                                />
                                <Input 
                                    label="Years of Exp."
                                    type="number"
                                    value={formData.years_experience}
                                    onChange={(e) => handleInputChange('years_experience', parseFloat(e.target.value) || 0)}
                                    {...getFieldStatus('years_experience')}
                                />
                            </div>
                        </Card>

                        {/* Section: Financials */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: 'var(--color-text)' }}>
                                    <Calculator size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Money & Savings</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <Input 
                                    label="Monthly Take-Home Pay (₹)"
                                    type="number"
                                    value={formData.monthly_net_income}
                                    onChange={(e) => handleInputChange('monthly_net_income', parseFloat(e.target.value) || 0)}
                                    {...getFieldStatus('monthly_net_income')}
                                />
                                <Input 
                                    label="Monthly Living Costs (₹)"
                                    type="number"
                                    value={formData.monthly_expenses}
                                    onChange={(e) => handleInputChange('monthly_expenses', parseFloat(e.target.value) || 0)}
                                    {...getFieldStatus('monthly_expenses')}
                                />
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input 
                                        label="Total Savings Available (₹)"
                                        type="number"
                                        value={formData.liquid_savings}
                                        onChange={(e) => handleInputChange('liquid_savings', parseFloat(e.target.value) || 0)}
                                        {...getFieldStatus('liquid_savings')}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Section: Constraints */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: 'var(--color-text)' }}>
                                    <AlertCircle size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Time Commitment</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                                <Input 
                                    label="Hours for Learning / Wk"
                                    type="number"
                                    value={formData.weekly_hours_available}
                                    onChange={(e) => handleInputChange('weekly_hours_available', parseFloat(e.target.value) || 0)}
                                    {...getFieldStatus('weekly_hours_available')}
                                />
                                <Input 
                                    label="Other Constraints (like locations)"
                                    value={formData.hard_constraints?.join(', ')}
                                    onChange={(e) => handleInputChange('hard_constraints', e.target.value.split(',').map(s => s.trim()))}
                                    {...getFieldStatus('hard_constraints')}
                                />
                            </div>
                        </Card>
                    </div>

                    <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            size="lg" 
                            onClick={handleConfirm} 
                            disabled={saving || isFormInvalid}
                            style={{ width: '100%', maxWidth: '300px', opacity: isFormInvalid ? 0.5 : 1 }}
                        >
                            {saving ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Loader2 size={18} className="animate-spin" /> Saving Your Profile...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Looks Good, See My Options <ArrowRight size={18} />
                                </span>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};



export default ProfileReviewPage;
