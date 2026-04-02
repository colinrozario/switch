import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sliders, 
    TrendingDown, 
    TrendingUp, 
    History, 
    ArrowLeft, 
    CircleCheck, 
    CircleAlert, 
    Info 
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
                // For MVP, we fetch the roadmap then the bridge
                const roadmapRes = await endpoints.getRoadmap(roadmapId);
                const bridgeRes = await endpoints.getSalaryBridge(roadmapRes.data.salary_bridge_id);
                
                setBaseBridge(bridgeRes.data);
                setInputs({
                    monthly_expenses: bridgeRes.data.inputs.monthly_expenses,
                    transition_months: bridgeRes.data.inputs.transition_months,
                    liquid_savings: bridgeRes.data.inputs.liquid_savings,
                    weekly_hours_available: bridgeRes.data.inputs.weekly_hours_available
                });
                
                const historyRes = await endpoints.runSimulator(roadmapId, {}); // Get current baseline as run
                setPastRuns(prev => [historyRes.data]);
                
            } catch (error) {
                console.error("Failed to fetch simulator data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roadmapId]);

    // DB: runSimulator
    const triggerSimulation = useCallback(
        debounce(async (newInputs) => {
            try {
                const response = await endpoints.runSimulator(roadmapId, newInputs);
                setCurrentScenario(response.data);
                setPastRuns(prev => [response.data, ...prev].slice(0, 5)); // Keep last 5
            } catch (error) {
                console.error("Simulation failed", error);
            }
        }, 500),
        [roadmapId]
    );

    const handleSliderChange = (field, value) => {
        const updated = { ...inputs, [field]: parseFloat(value) };
        setInputs(updated);
        triggerSimulation(updated);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Initializing simulator sandbox...</h2>
            </div>
        );
    }

    const displayOut = currentScenario ? currentScenario.deterministic_out : baseBridge.outputs;
    const risk = getRiskLevel(displayOut.risk_score);

    return (
        <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>What-If Simulator</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Stress-test your assumptions and find a safer path.</p>
                    </div>
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft size={16} /> Back to Roadmap
                    </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    {/* Left: Sliders */}
                    <Card style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: 'var(--color-primary)' }}>
                            <Sliders size={20} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Adjust Variables</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <SliderControl 
                                label="Monthly Expenses" 
                                value={inputs.monthly_expenses} 
                                min={inputs.monthly_expenses * 0.5} 
                                max={inputs.monthly_expenses * 1.5} 
                                step={100}
                                unit="$"
                                onChange={(v) => handleSliderChange('monthly_expenses', v)}
                            />
                            <SliderControl 
                                label="Transition Timeline" 
                                value={inputs.transition_months} 
                                min={3} 
                                max={36} 
                                step={1}
                                unit=" Mo"
                                onChange={(v) => handleSliderChange('transition_months', v)}
                            />
                            <SliderControl 
                                label="Liquid Savings" 
                                value={inputs.liquid_savings} 
                                min={0} 
                                max={inputs.liquid_savings * 3} 
                                step={1000}
                                unit="$"
                                onChange={(v) => handleSliderChange('liquid_savings', v)}
                            />
                            <SliderControl 
                                label="Weekly Effort" 
                                value={inputs.weekly_hours_available} 
                                min={2} 
                                max={40} 
                                step={1}
                                unit=" Hrs"
                                onChange={(v) => handleSliderChange('weekly_hours_available', v)}
                            />
                        </div>
                    </Card>

                    {/* Right: Results & Comparison */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Summary Result */}
                        <Card style={{ padding: '32px', borderColor: risk.color }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px', letterSpacing: '1px' }}>RISK SCORE</div>
                                    <div style={{ fontSize: '4.5rem', fontWeight: '800', color: risk.color }}>{displayOut.risk_score}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: risk.color }}>{risk.label}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <StatRow label="Monthly Burn" value={`$${Math.round(displayOut.total_bridge_required / (inputs.transition_months || 1))}`} />
                                    <StatRow label="Bridge Required" value={`$${Math.round(displayOut.total_bridge_required).toLocaleString()}`} />
                                    <StatRow label="Runway Buffer" value={`${Math.round(displayOut.runway_months)} Months`} />
                                </div>
                            </div>

                            {currentScenario?.narrative && (
                                <div style={narrativeStyle}>
                                    <Info size={16} style={{ marginTop: '3px' }} />
                                    <p>{currentScenario.narrative}</p>
                                </div>
                            )}
                        </Card>

                        {/* Past Runs History */}
                        <Card style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
                                <History size={18} />
                                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Recent Scenarios</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {pastRuns.map((run, i) => (
                                    <div key={i} style={historyItemStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                             <Shield style={{ color: getRiskLevel(run.deterministic_out.risk_score).color }} size={16} />
                                             <span style={{ fontWeight: '600' }}>Score: {run.deterministic_out.risk_score}</span>
                                        </div>
                                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                            ${run.modified_inputs.monthly_expenses || inputs.monthly_expenses} Exp / {run.modified_inputs.transition_months || inputs.transition_months} Mo
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const SliderControl = ({ label, value, min, max, step, unit, onChange }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{label}</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{unit}{Math.round(value).toLocaleString()}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            style={sliderStyle}
        />
    </div>
);

const StatRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{value}</span>
    </div>
);

const Shield = ({ size, color }) => (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: color }} />
    </div>
);

const getRiskLevel = (score) => {
    if (score <= 40) return { label: "High Risk", color: "#ff4444" };
    if (score <= 70) return { label: "Medium Risk", color: "#ffbb33" };
    return { label: "Safe Path", color: "var(--color-primary)" };
};

const sliderStyle = {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    appearance: 'none',
    outline: 'none',
    accentColor: 'var(--color-primary)'
};

const narrativeStyle = {
    marginTop: '32px',
    padding: '20px',
    background: 'rgba(215, 254, 3, 0.05)',
    border: '1px solid rgba(215, 254, 3, 0.1)',
    borderRadius: '12px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    display: 'flex',
    gap: '12px',
    color: '#eee'
};

const historyItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)'
};

export default SimulatorPage;
