import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Loader2,
    CheckCircle2,
    Edit3,
    Link,
    Github,
    Briefcase,
    User,
    DollarSign,
    Clock,
    MapPin,
    Target,
    ExternalLink,
    FileText,
    Linkedin,
    Globe,
    AlertCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const ProfileReviewPage = () => {
    const navigate = useNavigate();
    const { profileId, diagnosis } = useStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Enrichment fields — new info we haven't asked before
    const [enrichment, setEnrichment] = useState({
        linkedin_url: '',
        portfolio_url: '',
        github_url: '',
        resume_text: '',
        other_links: '',
    });

    const [activeTab, setActiveTab] = useState('confirm'); // 'confirm' | 'enrich'

    useEffect(() => {
        if (!profileId) {
            navigate('/diagnosis');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await endpoints.getIntake(profileId);
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId, navigate]);

    const handleEnrichmentChange = (field, value) => {
        setEnrichment(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = async () => {
        setSaving(true);
        try {
            // Only send enrichment fields that have values
            const enrichmentPayload = {};
            Object.entries(enrichment).forEach(([k, v]) => {
                if (v && v.trim()) enrichmentPayload[k] = v.trim();
            });

            if (Object.keys(enrichmentPayload).length > 0) {
                await endpoints.updateIntake(profileId, enrichmentPayload);
            }

            navigate('/options');
        } catch (error) {
            console.error("Failed to save enrichment", error);
            // Non-blocking — move ahead anyway if enrichment save fails
            navigate('/options');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} style={{ color: 'var(--color-accent)', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Loading your profile...</h2>
            </div>
        );
    }

    const structured = profile?.structured || {};
    const confidenceScores = profile?.confidence_scores || {};

    const getConfidenceBadge = (field) => {
        const score = confidenceScores[field];
        if (!score) return null;
        if (score >= 0.9) return { label: 'High confidence', color: '#059669', bg: '#ECFDF5' };
        if (score >= 0.7) return { label: 'Verified', color: '#D97706', bg: '#FFFBEB' };
        return { label: 'Inferred', color: '#DC2626', bg: '#FEF2F2' };
    };

    const hasAnyEnrichment = Object.values(enrichment).some(v => v.trim());

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                    {/* Page Header */}
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
                            STEP 2: PROFILE SNAPSHOT
                        </div>
                        <h1 style={{ fontSize: '40px', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                            Here's what we know about you
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', lineHeight: 1.5, maxWidth: '680px' }}>
                            We've built your profile from the diagnosis. Optionally, add your LinkedIn, resume, or portfolio links to get sharper, more personalised recommendations.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div style={{
                        display: 'flex',
                        gap: '0',
                        marginBottom: '40px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        padding: '4px',
                        width: 'fit-content'
                    }}>
                        {[
                            { id: 'confirm', label: 'Your Profile', icon: User },
                            { id: 'enrich', label: 'Add More Context', icon: Link }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeTab === id ? 'var(--color-primary)' : 'transparent',
                                    color: activeTab === id ? '#FFFFFF' : 'var(--color-text-secondary)',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Icon size={16} />
                                {label}
                                {id === 'enrich' && hasAnyEnrichment && (
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
                                )}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'confirm' && (
                            <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                {/* Profile Snapshot Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                    {/* Identity Row */}
                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={User} title="Professional Background" />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                            <ProfileField
                                                label="Current Role"
                                                value={structured.current_role || diagnosis?.currentRole || '—'}
                                                icon={Briefcase}
                                                badge={getConfidenceBadge('current_role')}
                                            />
                                            <ProfileField
                                                label="Years of Experience"
                                                value={structured.years_experience ? `${structured.years_experience} years` : (diagnosis?.yearsExperience ? `${diagnosis.yearsExperience} years` : '—')}
                                                icon={Target}
                                                badge={getConfidenceBadge('years_experience')}
                                            />
                                            <ProfileField
                                                label="Industry"
                                                value={structured.industry || diagnosis?.industry || '—'}
                                                icon={Globe}
                                            />
                                        </div>
                                    </Card>

                                    {/* Financials Row */}
                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={DollarSign} title="Financial Snapshot" />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                            <ProfileField
                                                label="Monthly Expenses"
                                                value={
                                                    structured.monthly_expenses
                                                        ? `₹${Number(structured.monthly_expenses).toLocaleString()}`
                                                        : diagnosis?.financials?.expenses
                                                            ? `₹${Number(diagnosis.financials.expenses).toLocaleString()}`
                                                            : '—'
                                                }
                                                icon={DollarSign}
                                                badge={getConfidenceBadge('monthly_expenses')}
                                            />
                                            <ProfileField
                                                label="Total Savings"
                                                value={
                                                    structured.liquid_savings
                                                        ? `₹${Number(structured.liquid_savings).toLocaleString()}`
                                                        : diagnosis?.financials?.savings
                                                            ? `₹${Number(diagnosis.financials.savings).toLocaleString()}`
                                                            : '—'
                                                }
                                                icon={DollarSign}
                                                badge={getConfidenceBadge('liquid_savings')}
                                            />
                                            <ProfileField
                                                label="Est. Take-Home"
                                                value={
                                                    structured.monthly_net_income
                                                        ? `₹${Number(structured.monthly_net_income).toLocaleString()}/mo`
                                                        : '—'
                                                }
                                                icon={DollarSign}
                                                badge={getConfidenceBadge('monthly_net_income')}
                                                note="Estimated from your expenses"
                                            />
                                        </div>
                                    </Card>

                                    {/* Schedule & Constraints */}
                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={Clock} title="Schedule & Constraints" />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <ProfileField
                                                label="Hours Available / Week"
                                                value={
                                                    structured.weekly_hours_available
                                                        ? `${structured.weekly_hours_available} hrs/wk`
                                                        : diagnosis?.constraints?.hours
                                                            ? `${diagnosis.constraints.hours} hrs/wk`
                                                            : '—'
                                                }
                                                icon={Clock}
                                                badge={getConfidenceBadge('weekly_hours_available')}
                                            />
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Constraints</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {(structured.hard_constraints?.length
                                                        ? structured.hard_constraints
                                                        : diagnosis?.constraints?.location
                                                            ? [diagnosis.constraints.location]
                                                            : ['None specified']
                                                    ).map((c, i) => (
                                                        <span key={i} style={{
                                                            padding: '4px 12px',
                                                            background: '#F1F5F9',
                                                            borderRadius: '6px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            color: 'var(--color-text)'
                                                        }}>{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Goal */}
                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={Target} title="Career Goal" />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <ProfileField
                                                label="Goal Type"
                                                value={
                                                    structured.goal_type
                                                        ? (structured.goal_type === 'specific' ? 'Has a target role' : 'Exploring options')
                                                        : diagnosis?.goal?.type
                                                            ? (diagnosis.goal.type === 'specific' ? 'Has a target role' : 'Exploring options')
                                                            : '—'
                                                }
                                                icon={Target}
                                            />
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Motivations</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {(diagnosis?.goal?.motivations?.length
                                                        ? diagnosis.goal.motivations
                                                        : ['Not specified']
                                                    ).map((m, i) => (
                                                        <span key={i} style={{
                                                            padding: '4px 12px',
                                                            background: 'var(--color-surface)',
                                                            border: '1px solid var(--color-border)',
                                                            borderRadius: '99px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            color: 'var(--color-text-secondary)'
                                                        }}>{m}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Something wrong nudge */}
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                        <AlertCircle size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600', margin: 0 }}>
                                            Something wrong? The most important thing is the financial data.{' '}
                                            <button
                                                onClick={() => navigate('/diagnosis')}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                                            >
                                                Go back and redo diagnosis
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'enrich' && (
                            <motion.div key="enrich" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                    {/* Why enrich callout */}
                                    <div style={{ padding: '24px', background: '#F0F9FF', borderRadius: '16px', border: '1px solid #BAE6FD', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                        <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '10px', flexShrink: 0 }}>
                                            <Target size={18} style={{ color: '#0369A1' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0369A1', marginBottom: '4px' }}>Why add this?</div>
                                            <div style={{ fontSize: '14px', color: '#0C4A6E', fontWeight: '500', lineHeight: 1.6 }}>
                                                Your LinkedIn, resume, or portfolio helps us build a sharper picture of your actual skills, projects, and market signal. Everything is optional — add what you have.
                                            </div>
                                        </div>
                                    </div>

                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={Briefcase} title="Professional Profiles" />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <EnrichmentInput
                                                icon={Linkedin}
                                                label="LinkedIn Profile URL"
                                                placeholder="https://linkedin.com/in/your-name"
                                                value={enrichment.linkedin_url}
                                                onChange={v => handleEnrichmentChange('linkedin_url', v)}
                                            />
                                            <EnrichmentInput
                                                icon={Github}
                                                label="GitHub Profile URL"
                                                placeholder="https://github.com/your-handle"
                                                value={enrichment.github_url}
                                                onChange={v => handleEnrichmentChange('github_url', v)}
                                            />
                                            <EnrichmentInput
                                                icon={Globe}
                                                label="Portfolio / Personal Website"
                                                placeholder="https://yourportfolio.com"
                                                value={enrichment.portfolio_url}
                                                onChange={v => handleEnrichmentChange('portfolio_url', v)}
                                            />
                                            <EnrichmentInput
                                                icon={ExternalLink}
                                                label="Other relevant links (Behance, Dribbble, Medium, etc.)"
                                                placeholder="https://..."
                                                value={enrichment.other_links}
                                                onChange={v => handleEnrichmentChange('other_links', v)}
                                            />
                                        </div>
                                    </Card>

                                    <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                        <SectionHeader icon={FileText} title="Resume / Work Summary" />
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '16px', lineHeight: 1.6 }}>
                                            Paste your resume text, a key project description, or a short work bio. This significantly improves the quality of career path matches.
                                        </p>
                                        <textarea
                                            value={enrichment.resume_text}
                                            onChange={e => handleEnrichmentChange('resume_text', e.target.value)}
                                            placeholder="e.g. 5 years in enterprise B2B sales at [Company]. Managed a ₹12Cr portfolio, led a team of 6. Strong in CRM tools, negotiation, and closing complex deals. Currently studying for PMP..."
                                            rows={8}
                                            style={{
                                                width: '100%',
                                                padding: '16px',
                                                borderRadius: '12px',
                                                border: '1.5px solid var(--color-border)',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: 'var(--color-text)',
                                                background: '#FAFAFA',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                                lineHeight: 1.6,
                                                outline: 'none',
                                                transition: 'border-color 0.2s ease',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                                        />
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600', marginTop: '8px' }}>
                                            {enrichment.resume_text.length} characters · No formatting needed — just the text
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA */}
                    <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                            {hasAnyEnrichment
                                ? <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} /> Profile enriched — great for accuracy</span>
                                : "You can skip enrichment and continue with just your diagnosis data"
                            }
                        </div>
                        <Button
                            size="lg"
                            onClick={handleConfirm}
                            disabled={saving}
                            style={{ minWidth: '280px', height: '56px', fontSize: '16px' }}
                        >
                            {saving ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {hasAnyEnrichment ? 'Save & See My Career Options' : 'Looks Good — See My Options'}
                                    <ArrowRight size={18} />
                                </span>
                            )}
                        </Button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

/* ── Sub-components ───────────────────────────────────────────── */

const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: 'var(--color-text)' }}>
            <Icon size={18} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>{title}</h3>
    </div>
);

const ProfileField = ({ label, value, icon: Icon, badge, note }) => (
    <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            {label}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text)', letterSpacing: '-0.01em', marginBottom: '4px' }}>
            {value}
        </div>
        {badge && (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: badge.bg,
                color: badge.color,
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '99px',
                marginTop: '4px'
            }}>
                {badge.label}
            </div>
        )}
        {note && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500', marginTop: '4px' }}>
                {note}
            </div>
        )}
    </div>
);

const EnrichmentInput = ({ icon: Icon, label, placeholder, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon size={14} /> {label}
        </label>
        <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border)',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-text)',
                background: '#FAFAFA',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
    </div>
);

export default ProfileReviewPage;
