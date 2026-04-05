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
                // Fetch roadmap to get bridge ID if not in store
                const roadmapRes = await endpoints.getRoadmap(roadmapId);
                const bridgeRes = await endpoints.getSalaryBridge(roadmapRes.data.salary_bridge_id);
                
                setBaseBridge(bridgeRes.data);
                const initialInputs = {
                    monthly_expenses: bridgeRes.data.inputs.monthly_expenses,
                    transition_months: bridgeRes.data.inputs.transition_months,
                    liquid_savings: bridgeRes.data.inputs.liquid_savings,
                    weekly_hours_available: bridgeRes.data.inputs.weekly_hours_available
                };
                setInputs(initialInputs);
                
                // Initial baseline simulation
                const historyRes = await endpoints.runSimulator(roadmapId, {});
                setPastRuns([historyRes.data]);
                
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
                setCurrentScenario(response.data);
                setPastRuns(prev => [response.data, ...prev].slice(0, 5));
            } catch (error) {
                console.error("Simulation failed", error);
            } finally {
                setSimulating(false);
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
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Getting your simulator ready...</h2>
            </div>
        );
    }

    const displayOut = currentScenario ? currentScenario.deterministic_out : (baseBridge ? baseBridge.outputs : null);
    
    if (!displayOut) return null;

    const getRiskConfig = (score) => {
        if (score <= 40) return { label: "Careful!", color: "#DC2626", bg: "#FEF2F2" };
        if (score <= 70) return { label: "Looking Good", color: "#B45309", bg: "#FFFBEB" };
        return { label: "Very Safe", color: "#059669", bg: "#ECFDF5" };
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
                                <Zap size={14} style={{ color: 'var(--color-text)' }} /> TRY A SCENARIO
                            </div>
                            <h1 style={{ fontSize: '40px', letterSpacing: '-0.02em', fontWeight: '800' }}>Practice Your Move</h1>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px', marginTop: '8px' }}>
                                See how changing your savings, costs, or timeline affects your safety.
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <SliderControl 
                                    label="Monthly Costs" 
                                    value={inputs.monthly_expenses} 
                                    min={500} 
                                    max={10000} 
                                    step={100}
                                    prefix="₹"
                                    onChange={(v) => handleSliderChange('monthly_expenses', v)}
                                />
                                <SliderControl 
                                    label="How many months?" 
                                    value={inputs.transition_months} 
                                    min={1} 
                                    max={24} 
                                    step={1}
                                    suffix=" Months"
                                    onChange={(v) => handleSliderChange('transition_months', v)}
                                />
                                <SliderControl 
                                    label="Total Savings" 
                                    value={inputs.liquid_savings} 
                                    min={0} 
                                    max={100000} 
                                    step={1000}
                                    prefix="₹"
                                    onChange={(v) => handleSliderChange('liquid_savings', v)}
                                />
                                <SliderControl 
                                    label="Hours per week" 
                                    value={inputs.weekly_hours_available} 
                                    min={0} 
                                    max={60} 
                                    step={1}
                                    suffix=" Hrs"
                                    onChange={(v) => handleSliderChange('weekly_hours_available', v)}
                                />
                            </div>
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

                            {/* Run History */}
                            <Card padding="32px" style={{ background: '#FFFFFF' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: '10px', color: 'var(--color-text-secondary)' }}>
                                        <History size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Previous Scenarios</h3>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {pastRuns.length === 0 && <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Try a few changes to see what happens.</div>}
                                    {pastRuns.map((run, i) => {
                                        const runRisk = getRiskConfig(run.deterministic_out.risk_score);
                                        return (
                                            <div key={i} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                padding: '12px 20px', 
                                                background: 'var(--color-surface)', 
                                                borderRadius: '12px', 
                                                border: '1px solid var(--color-border)' 
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: runRisk.color }} />
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Safety Score: {run.deterministic_out.risk_score}</div>
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                                    ₹{run.modified_inputs.monthly_expenses || inputs.monthly_expenses} Cost • {run.modified_inputs.transition_months || inputs.transition_months}mo Span
                                                </div>
                                            </div>
                                        );
                                    })}
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
