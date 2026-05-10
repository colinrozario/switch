import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Map, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain, label: 'Assess', color: '#f59e0b',
    title: 'Know which careers you can realistically win.',
    desc: 'Our AI analyzes your current skills, role history, and market data to surface career paths ranked by real success probability — not guesswork.',
    items: ['Skills gap analysis', 'Market demand scoring', 'Risk-adjusted match scores', 'Salary trajectory modeling'],
    mockup: [
      { role: 'Product Manager → Data PM', pct: 94, c: '#d4ff4a' },
      { role: 'SDE → Engineering Manager', pct: 78, c: '#6ee7b7' },
      { role: 'Analyst → ML Engineer', pct: 61, c: '#93c5fd' },
    ],
  },
  {
    icon: Shield, label: 'Bridge', color: '#22c55e',
    title: 'Know exactly when it is safe to make your move.',
    desc: 'Model income gaps, retraining costs, and savings thresholds month by month — so you never switch at the financially wrong time.',
    items: ['Monthly cash-flow modeling', 'Emergency fund threshold', 'Break-even timeline', 'Scenario stress-testing'],
    mockup: [
      { label: 'Current Savings', val: '₹4.8L', bar: 72, c: '#d4ff4a' },
      { label: 'Required Buffer', val: '₹3.2L', bar: 48, c: '#6ee7b7' },
      { label: 'Monthly Gap', val: '₹22,000', bar: 30, c: '#f87171' },
    ],
  },
  {
    icon: Map, label: 'Execute', color: '#6366f1',
    title: 'A week-by-week plan built around your real life.',
    desc: 'Phase-by-phase execution with specific courses, projects, and milestones — sequenced around your salary, expenses, and target role.',
    items: ['Phase-based milestones', 'Course & cert recommendations', 'Portfolio project plan', 'Interview prep timeline'],
    mockup: [
      { phase: 'Phase 1: Foundation', weeks: 'Weeks 1–6',  done: true },
      { phase: 'Phase 2: Portfolio',  weeks: 'Weeks 7–14', done: false },
      { phase: 'Phase 3: Apply',      weeks: 'Weeks 15–20', done: false },
    ],
  },
];

function FeatureMockup({ feature, idx }) {
  if (idx === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {feature.mockup.map(m => (
        <div key={m.role} style={{
          background: '#0e1c2e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: '600' }}>{m.role}</span>
            <span style={{ color: m.c, fontSize: '14px', fontWeight: '800' }}>{m.pct}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px' }}>
            <div style={{ width: `${m.pct}%`, height: '100%', background: m.c, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (idx === 1) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {feature.mockup.map(m => (
        <div key={m.label} style={{
          background: '#0e1c2e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{m.label}</span>
            <span style={{ color: m.c, fontSize: '14px', fontWeight: '800' }}>{m.val}</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px' }}>
            <div style={{ width: `${m.bar}%`, height: '100%', background: m.c, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {feature.mockup.map(m => (
        <div key={m.phase} style={{
          background: '#0e1c2e', border: `1px solid ${m.done ? 'rgba(212,255,74,0.2)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '10px', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
            background: m.done ? '#d4ff4a' : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {m.done && <CheckCircle size={12} color="#0a1a00" />}
          </div>
          <div>
            <div style={{ color: m.done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>{m.phase}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px' }}>{m.weeks}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const f = FEATURES[active];
  const Icon = f.icon;

  return (
    <section id="features" style={{ background: '#ffffff', padding: '120px 24px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block', background: '#f0fdf4', color: '#16a34a',
            fontSize: '12px', fontWeight: '700', padding: '5px 14px',
            borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '20px', border: '1px solid #bbf7d0',
          }}>Platform</div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 'clamp(32px,4vw,54px)', fontWeight: '400',
            color: '#0a0f1e', letterSpacing: '-0.025em', marginBottom: '16px',
          }}>
            Everything you need to switch careers{' '}
            <span style={{ fontStyle: 'italic', color: '#6b7280' }}>with confidence.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
            Three engines working together so you never make a blind career move.
          </p>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '56px' }}>
          {FEATURES.map((feat, i) => {
            const FIcon = feat.icon;
            const isAct = i === active;
            return (
              <button
                key={feat.label}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 22px', borderRadius: '99px', fontSize: '14px',
                  fontWeight: isAct ? '700' : '500', cursor: 'pointer',
                  border: isAct ? `2px solid ${feat.color}` : '2px solid #e5e7ef',
                  background: isAct ? feat.color + '14' : '#ffffff',
                  color: isAct ? feat.color : '#6b7280',
                  transition: 'all 0.22s ease',
                }}
              >
                <FIcon size={15} />
                {feat.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16,1,0.3,1] }}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
            alignItems: 'center',
            background: '#020d1a', borderRadius: '24px', padding: '56px',
          }}
        >
          {/* Left text */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: f.color + '18', border: `1px solid ${f.color}33`,
              borderRadius: '99px', padding: '6px 14px', marginBottom: '24px',
            }}>
              <Icon size={14} color={f.color} />
              <span style={{ color: f.color, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</span>
            </div>
            <h3 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(26px,2.8vw,38px)', fontWeight: '400',
              color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '18px', lineHeight: 1.2,
            }}>
              {f.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
              {f.desc}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {f.items.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={15} color="#d4ff4a" />
                  <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px', fontWeight: '500' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right mockup */}
          <div>
            <FeatureMockup feature={f} idx={active} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
