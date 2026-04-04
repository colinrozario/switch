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
                
                // Merge structured data with defaults if needed
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
            alert("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Retrieving analyzed profile...</h2>
            </div>
        );
    }

    const confidenceScores = profile?.confidence_scores || {};
    const isLowConfidence = (field) => (confidenceScores[field] || 1) < 0.7;

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
                            SYSTEM OUTPUT: PROFILE EXTRACTION
                        </div>
                        <h1 style={{ fontSize: '40px', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                            Verify your profile audit.
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', lineHeight: 1.5 }}>
                            Our agent has extracted these coordinates from your diagnosis. Please review and adjust any values highlighted in <span style={{ color: '#F59E0B', fontWeight: '600' }}>amber</span>—these were inferred with lower certainty.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        {/* Section: Identity */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: '10px', color: 'var(--color-primary)' }}>
                                    <User size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Professional Identity</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Current Occupation"
                                        value={formData.current_role}
                                        onChange={(e) => handleInputChange('current_role', e.target.value)}
                                        icon={FileEdit}
                                    />
                                    {isLowConfidence('current_role') && <ConfidenceAlert />}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Years Exp."
                                        type="number"
                                        value={formData.years_experience}
                                        onChange={(e) => handleInputChange('years_experience', parseFloat(e.target.value))}
                                    />
                                    {isLowConfidence('years_experience') && <ConfidenceAlert />}
                                </div>
                            </div>
                        </Card>

                        {/* Section: Financials */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: '10px', color: 'var(--color-primary)' }}>
                                    <Calculator size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Financial Coordinates</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Monthly Net Income ($)"
                                        type="number"
                                        value={formData.monthly_net_income}
                                        onChange={(e) => handleInputChange('monthly_net_income', parseFloat(e.target.value))}
                                    />
                                    {isLowConfidence('monthly_net_income') && <ConfidenceAlert />}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Monthly Living Expenses ($)"
                                        type="number"
                                        value={formData.monthly_expenses}
                                        onChange={(e) => handleInputChange('monthly_expenses', parseFloat(e.target.value))}
                                    />
                                    {isLowConfidence('monthly_expenses') && <ConfidenceAlert />}
                                </div>
                                <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                                    <Input 
                                        label="Total Liquid Savings ($)"
                                        type="number"
                                        value={formData.liquid_savings}
                                        onChange={(e) => handleInputChange('liquid_savings', parseFloat(e.target.value))}
                                    />
                                    {isLowConfidence('liquid_savings') && <ConfidenceAlert />}
                                </div>
                            </div>
                        </Card>

                        {/* Section: Constraints */}
                        <Card padding="32px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: '10px', color: 'var(--color-primary)' }}>
                                    <AlertCircle size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Temporal Constraints</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Investable Hrs/Wk"
                                        type="number"
                                        value={formData.weekly_hours_available}
                                        onChange={(e) => handleInputChange('weekly_hours_available', parseFloat(e.target.value))}
                                    />
                                    {isLowConfidence('weekly_hours_available') && <ConfidenceAlert />}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        label="Hard Constraints (comma separated)"
                                        value={formData.hard_constraints?.join(', ')}
                                        onChange={(e) => handleInputChange('hard_constraints', e.target.value.split(',').map(s => s.trim()))}
                                    />
                                    {isLowConfidence('hard_constraints') && <ConfidenceAlert />}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            size="lg" 
                            onClick={handleConfirm} 
                            disabled={saving}
                            style={{ width: '100%', maxWidth: '300px' }}
                        >
                            {saving ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Loader2 size={18} className="animate-spin" /> Finalizing System Registry...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Confirm Audit & View Paths <ArrowRight size={18} />
                                </span>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const ConfidenceAlert = () => (
    <div style={{ 
        position: 'absolute', 
        right: '0', 
        top: '0', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        color: '#F59E0B',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
    }}>
        <CircleAlert size={12} /> Verify
    </div>
);

export default ProfileReviewPage;
