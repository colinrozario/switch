import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sliders, 
    TrendingDown, 
    TrendingUp, 
    History, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle, 
    Info,
    LayoutDashboard,
    Zap,
    Scale,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import debounce from 'lodash/debounce';
import useStore from '../store/useStore';
import { endpoints } from '../api/endpoints';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const SimulatorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bridgeId } = useStore();
    
    const params = new URLSearchParams(location.search);
    const roadmapId = params.get('id');

    const [baseBridge, setBaseBridge] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [pastRuns, setPastRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    
    // Sliders state
    const [inputs, setInputs] = useState({
        monthly_expenses: 0,
        transition_months: 0,
        liquid_savings: 0,
        weekly_hours_available: 0
    });

    useEffect(() => {
        if (!roadmapId) {
            navigate('/diagnosis');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch roadmap first
                const roadmapRes = await endpoints.getRoadmap(roadmapId);
                const roadmapData = roadmapRes.data;

                // Fetch the bridge by its actual ID (not path_set_id)
                const bridgeRes = await endpoints.getBridgeById(roadmapData.salary_bridge_id);
                
                setBaseBridge(bridgeRes.data);
                const initialInputs = {
                    monthly_expenses: bridgeRes.data.inputs.monthly_expenses,
                    transition_months: bridgeRes.data.inputs.transition_months,
                    side_income: bridgeRes.data.inputs.side_income || 0,
                    weekly_hours_available: bridgeRes.data.inputs.weekly_hours_available
                };
                setInputs(initialInputs);
                
                // Initial baseline simulation
                const historyRes = await endpoints.runSimulator(roadmapId, {});
                const baseRun = { ...historyRes.data, isBase: true, label: 'Base' };
                setPastRuns([baseRun]);
                setCurrentScenario(baseRun);
                
            } catch (error) {
                console.error("Failed to fetch simulator data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roadmapId, navigate]);


    const triggerSimulation = useCallback(
        debounce(async (newInputs) => {
            setSimulating(true);
            try {
                const response = await endpoints.runSimulator(roadmapId, newInputs);
                const scenario = { ...response.data, label: `Sim ${pastRuns.length}` };
                setCurrentScenario(scenario);
                setPastRuns(prev => {
                    const exists = prev.find(p => JSON.stringify(p.modified_inputs) === JSON.stringify(newInputs));
                    if (exists) return prev;
                    return [...prev, scenario].slice(0, 5);
                });
            } catch (error) {
                console.error("Simulation failed", error);
            } finally {
                setSimulating(false);
            }
        }, 500),
        [roadmapId, pastRuns]
    );

    const handleSliderChange = (field, value) => {
        const updated = { ...inputs, [field]: parseFloat(value) };
        setInputs(updated);
        triggerSimulation(updated);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Getting your simulator ready...</h2>
            </div>
        );
    }

    const displayOut = currentScenario ? currentScenario.deterministic_out : (baseBridge ? baseBridge.outputs : null);
    
    if (!displayOut) return null;

    const getRiskConfig = (score) => {
        if (score <= 40) return { label: "Capital Risk", color: "#B91C1C", bg: "#FEF2F2" };
        if (score <= 75) return { label: "Stable Buffer", color: "#B45309", bg: "#FFFBEB" };
        return { label: "Low Risk", color: "#059669", bg: "#ECFDF5" };
    };

    const risk = getRiskConfig(displayOut.risk_score);

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
                        <div>
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
                                marginBottom: '16px'
                            }}>
                                <Zap size={14} style={{ color: 'var(--color-text)' }} /> STRESS TEST YOUR PLAN
                            </div>
                            <h1 style={{ fontSize: '40px', letterSpacing: '-0.02em', fontWeight: '800' }}>Practice Your Move</h1>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', marginTop: '8px' }}>
                                We've built this simulator to help you stress-test your plan. Change the variables to see where your limits are.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(-1)} style={{ background: '#FFFFFF' }}>
                            <ArrowLeft size={16} /> Back to My Plan
                        </Button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px' }}>
                        {/* Control Panel */}
                        <Card padding="32px" style={{ background: '#FFFFFF', height: 'fit-content' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: 'var(--color-text)' }}>
                                    <Sliders size={20} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>What if...</h3>
                            </div>

                             <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '32px' }}>
                                <SliderControl 
                                    label="Monthly Overhead" 
                                    value={inputs.monthly_expenses} 
                                    min={baseBridge.inputs.monthly_expenses * 0.5} 
                                    max={baseBridge.inputs.monthly_expenses * 1.5} 
                                    step={5000}
                                    prefix="₹"
                                    onChange={(v) => handleSliderChange('monthly_expenses', v)}
                                />
                                <SliderControl 
                                    label="Transition Span" 
                                    value={inputs.transition_months} 
                                    min={6} 
                                    max={36} 
                                    step={1}
                                    suffix=" Months"
                                    onChange={(v) => handleSliderChange('transition_months', v)}
                                />
                                <SliderControl 
                                    label="Side Income" 
                                    value={inputs.side_income || 0} 
                                    min={0} 
                                    max={baseBridge.inputs.monthly_income} 
                                    step={5000}
                                    prefix="₹"
                                    onChange={(v) => handleSliderChange('side_income', v)}
                                />
                                <SliderControl 
                                    label="Weekly Available Hours" 
                                    value={inputs.weekly_hours_available} 
                                    min={5} 
                                    max={40} 
                                    step={1}
                                    suffix=" Hrs"
                                    onChange={(v) => handleSliderChange('weekly_hours_available', v)}
                                />
                            </div>

                            {/* NARRATIVE BLOCK (Below Sliders) */}
                            <AnimatePresence mode="wait">
                                {currentScenario?.narrative && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        style={{ 
                                            padding: '24px', 
                                            background: '#F8FAFC', 
                                            borderRadius: '16px',
                                            border: '1px solid var(--color-border)',
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <div style={{ padding: '6px', background: '#FFFFFF', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                                            <Info size={16} style={{ color: 'var(--color-accent)' }} />
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontWeight: '700' }}>
                                            {currentScenario.narrative}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>

                        {/* Analysis View */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Main Result Card */}
                            <Card padding="0" style={{ overflow: 'hidden', background: '#FFFFFF' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '350px' }}>
                                    <div style={{ 
                                        padding: '48px', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        borderRight: '1px solid var(--color-border)',
                                        background: risk.bg,
                                        position: 'relative'
                                    }}>
                                        {simulating && (
                                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                                <Loader2 size={20} className="animate-spin" style={{ color: risk.color, opacity: 0.5 }} />
                                            </div>
                                        )}
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: risk.color, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
                                            Your Safety Score
                                        </div>
                                        <div style={{ fontSize: '100px', fontWeight: '800', color: risk.color, lineHeight: 1, letterSpacing: '-0.05em' }}>
                                            {displayOut.risk_score}
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '700', color: risk.color, marginTop: '8px' }}>
                                            {risk.label}
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '700' }}>Total Savings Used</div>
                                            <div style={{ fontSize: '20px', fontWeight: '800' }}>₹{Math.round(displayOut.total_bridge_required).toLocaleString()}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '700' }}>Monthly Cost</div>
                                            <div style={{ fontSize: '20px', fontWeight: '800' }}>₹{Math.round(displayOut.total_bridge_required / (inputs.transition_months || 1)).toLocaleString()}/mo</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '700' }}>Months of Safety</div>
                                            <div style={{ fontSize: '20px', fontWeight: '800' }}>{Math.round(displayOut.runway_months)} Months</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                    {currentScenario?.narrative && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            style={{ 
                                                borderTop: '1px solid var(--color-border)', 
                                                padding: '24px 48px', 
                                                background: 'var(--color-surface)',
                                                display: 'flex',
                                                gap: '16px',
                                                alignItems: 'flex-start'
                                            }}
                                        >
                                            <Info size={20} style={{ color: 'var(--color-accent)', marginTop: '2px' }} />
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: '500' }}>
                                                {currentScenario.narrative}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>

                            {/* Comparison Table */}
                            <Card padding="40px" style={{ background: '#FFFFFF' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                    <div style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: '10px', color: 'var(--color-text-secondary)' }}>
                                        <Scale size={20} />
                                    </div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '900' }}>Scenario Comparison</h3>
                                </div>
                                
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: '900', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Metric</th>
                                                {pastRuns.map((run, i) => (
                                                    <th key={i} style={{ 
                                                        textAlign: 'center', 
                                                        padding: '16px 20px', 
                                                        fontSize: '12px', 
                                                        fontWeight: '900', 
                                                        color: run.isBase ? 'var(--color-accent)' : 'var(--color-text)', 
                                                        textTransform: 'uppercase',
                                                        background: run.isBase ? '#F0F9FF' : 'transparent',
                                                        borderTopLeftRadius: run.isBase ? '12px' : '0',
                                                        borderTopRightRadius: run.isBase ? '12px' : '0'
                                                    }}>
                                                        {run.label} {run.isBase && '(Safe)'}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { label: 'Risk Score', key: 'risk_score' },
                                                { label: 'Bridge Required', key: 'total_bridge_required', prefix: '₹' },
                                                { label: 'Runway Months', key: 'runway_months', suffix: ' Mo' },
                                                { label: 'Weekly Effort', key: 'weekly_hours_available', suffix: ' Hrs' }
                                            ].map((row, rowIndex) => (
                                                <tr key={rowIndex} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>{row.label}</td>
                                                    {pastRuns.map((run, i) => {
                                                        const val = row.key === 'weekly_hours_available' ? (run.modified_inputs.weekly_hours_available || baseBridge.inputs.weekly_hours_available) : run.deterministic_out[row.key];
                                                        return (
                                                            <td key={i} style={{ 
                                                                textAlign: 'center', 
                                                                padding: '16px 20px', 
                                                                fontSize: '15px', 
                                                                fontWeight: '800',
                                                                background: run.isBase ? '#F0F9FF' : 'transparent',
                                                                color: row.key === 'risk_score' ? getRiskConfig(val).color : 'inherit'
                                                            }}>
                                                                {row.prefix}{Math.round(val).toLocaleString()}{row.suffix}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Operational Notice */}
                    <div style={{ marginTop: '80px', textAlign: 'center', padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                            <strong>Just so you know:</strong> This is a helpful tool, but it doesn't cover everything. 
                            It's a great way to see how your money might move, but keep a little extra for emergencies.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SliderControl = ({ label, value, min, max, step, prefix = "", suffix = "", onChange }) => (
    <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {label}
            </label>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-accent)' }}>
                {prefix}{Math.round(value).toLocaleString()}{suffix}
            </div>
        </div>
        <div style={{ position: 'relative', height: '6px', width: '100%', background: '#F1F5F9', borderRadius: '3px' }}>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '6px',
                    appearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    zIndex: 10,
                    outline: 'none'
                }}
            />
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                height: '100%', 
                width: `${((value - min) / (max - min)) * 100}%`, 
                background: 'var(--color-accent)', 
                borderRadius: '3px',
                zIndex: 5
            }} />
        </div>
    </div>
);

export default SimulatorPage;
