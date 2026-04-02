import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

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
                setFormData(response.data.structured || {});
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);

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
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Loading your profile...</h2>
            </div>
        );
    }

    const lowConfidenceFields = profile?.confidence_scores 
        ? Object.entries(profile.confidence_scores).filter(([_, score]) => score < 0.7).map(([field]) => field)
        : [];

    return (
        <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Review your profile</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                    We've inferred these details from your analysis. Please verify especially the financial figures.
                </p>

                <Card>
                    <div style={{ display: 'grid', gap: '32px' }}>
                        {/* Section: Professional */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-primary)' }}>Professional</h3>
                            <div style={gridStyle}>
                                <Field 
                                    label="Current Role" 
                                    value={formData.current_role} 
                                    onChange={(v) => handleInputChange('current_role', v)}
                                    isLowConfidence={lowConfidenceFields.includes('current_role')}
                                />
                                <Field 
                                    label="Years Experience" 
                                    type="number"
                                    value={formData.years_experience} 
                                    onChange={(v) => handleInputChange('years_experience', parseFloat(v))}
                                    isLowConfidence={lowConfidenceFields.includes('years_experience')}
                                />
                            </div>
                        </div>

                        {/* Section: Financials */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-primary)' }}>Financial Snapshot</h3>
                            <div style={gridStyle}>
                                <Field 
                                    label="Monthly Net Income ($)" 
                                    type="number"
                                    value={formData.monthly_net_income} 
                                    onChange={(v) => handleInputChange('monthly_net_income', parseFloat(v))}
                                    isLowConfidence={lowConfidenceFields.includes('monthly_net_income')}
                                />
                                <Field 
                                    label="Monthly Expenses ($)" 
                                    type="number"
                                    value={formData.monthly_expenses} 
                                    onChange={(v) => handleInputChange('monthly_expenses', parseFloat(v))}
                                    isLowConfidence={lowConfidenceFields.includes('monthly_expenses')}
                                />
                                <Field 
                                    label="Liquid Savings ($)" 
                                    type="number"
                                    value={formData.liquid_savings} 
                                    onChange={(v) => handleInputChange('liquid_savings', parseFloat(v))}
                                    isLowConfidence={lowConfidenceFields.includes('liquid_savings')}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Section: Constraints */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-primary)' }}>Availability & Constraints</h3>
                            <div style={gridStyle}>
                                <Field 
                                    label="Weekly Hours Available" 
                                    type="number"
                                    value={formData.weekly_hours_available} 
                                    onChange={(v) => handleInputChange('weekly_hours_available', parseFloat(v))}
                                    isLowConfidence={lowConfidenceFields.includes('weekly_hours_available')}
                                />
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Hard Constraints (Comma separated)</label>
                                    <textarea 
                                        value={formData.hard_constraints?.join(', ')} 
                                        onChange={(e) => handleInputChange('hard_constraints', e.target.value.split(',').map(s => s.trim()))}
                                        style={textareaStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                        <Button 
                            onClick={handleConfirm} 
                            disabled={saving}
                            style={{ width: '100%', maxWidth: '240px' }}
                        >
                            {saving ? "Saving..." : "Confirm & Continue →"}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

const Field = ({ label, value, onChange, type = "text", isLowConfidence, fullWidth }) => (
    <div style={{ gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
        <label style={labelStyle}>
            {label}
            {isLowConfidence && (
                <span style={{ color: '#ff9800', fontSize: '0.75rem', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> Verification suggested
                </span>
            )}
        </label>
        <input 
            type={type}
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            style={{
                ...inputStyle,
                borderColor: isLowConfidence ? '#ff9800' : 'rgba(255,255,255,0.1)'
            }}
        />
    </div>
);

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    fontWeight: '500'
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
};

const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit'
};

export default ProfileReviewPage;
