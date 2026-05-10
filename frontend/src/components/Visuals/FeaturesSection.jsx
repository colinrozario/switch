import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FONT = "'Lato', sans-serif";

const FEATURES = [
  {
    label: 'Assess', color: '#e8533a', borderColor: 'rgba(232,83,58,0.25)',
    title: 'Know which careers you can realistically win.',
    desc: 'Our AI analyzes your current skills, role history, and market data to surface career paths ranked by real success probability — not guesswork.',
    items: ['Skills gap analysis', 'Market demand scoring', 'Risk-adjusted match scores', 'Salary trajectory modeling'],
    mockup: [
      { role: 'Product Manager → Data PM',      pct: 94, c: '#e8533a' },
      { role: 'SDE → Engineering Manager',       pct: 78, c: '#2a9d6a' },
      { role: 'Analyst → ML Engineer',           pct: 61, c: '#3b6ef5' },
    ],
  },
  {
    label: 'Bridge', color: '#2a9d6a', borderColor: 'rgba(42,157,106,0.25)',
    title: 'Know exactly when it is safe to make your move.',
    desc: 'Model income gaps, retraining costs, and savings thresholds month by month — so you never switch at the financially wrong time.',
    items: ['Monthly cash-flow modeling', 'Emergency fund threshold', 'Break-even timeline', 'Scenario stress-testing'],
    mockup: [
      { label: 'Current Savings', val: '₹4.8L', bar: 72, c: '#2a9d6a' },
      { label: 'Required Buffer', val: '₹3.2L', bar: 48, c: '#3b6ef5' },
      { label: 'Monthly Gap',     val: '₹22k',  bar: 30, c: '#e8533a' },
    ],
  },
  {
    label: 'Execute', color: '#3b6ef5', borderColor: 'rgba(59,110,245,0.25)',
    title: 'A week-by-week plan built around your real life.',
    desc: 'Phase-by-phase execution with specific courses, projects, and milestones — sequenced around your salary, expenses, and target role.',
    items: ['Phase-based milestones', 'Course & cert recommendations', 'Portfolio project plan', 'Interview prep timeline'],
    mockup: [
      { phase: 'Phase 1: Foundation', weeks: 'Weeks 1–6',   done: true  },
      { phase: 'Phase 2: Portfolio',  weeks: 'Weeks 7–14',  done: false },
      { phase: 'Phase 3: Apply',      weeks: 'Weeks 15–20', done: false },
    ],
  },
];

function FeatureMockup({ f, idx }) {
  if (idx === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {f.mockup.map(m => (
        <div key={m.role} style={{
          background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '400', fontFamily: FONT }}>{m.role}</span>
            <span style={{ color: m.c, fontSize: '14px', fontWeight: '700', fontFamily: FONT }}>{m.pct}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px' }}>
            <div style={{ width: `${m.pct}%`, height: '100%', background: m.c, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (idx === 1) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {f.mockup.map(m => (
        <div key={m.label} style={{
          background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontFamily: FONT }}>{m.label}</span>
            <span style={{ color: m.c, fontSize: '14px', fontWeight: '700', fontFamily: FONT }}>{m.val}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px' }}>
            <div style={{ width: `${m.bar}%`, height: '100%', background: m.c, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {f.mockup.map(m => (
        <div key={m.phase} style={{
          background: '#1e1e1e',
          border: `1px solid ${m.done ? 'rgba(42,157,106,0.25)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '10px', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
            background: m.done ? '#2a9d6a' : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {m.done && <CheckCircle size={12} color="#fff" />}
          </div>
          <div>
            <div style={{ color: m.done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: m.done ? '700' : '400', fontFamily: FONT }}>{m.phase}</div>
            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', marginTop: '2px', fontFamily: FONT }}>{m.weeks}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const f = FEATURES[active];

  return (
    <section id="features" style={{ background: '#faf9f7', padding: '120px 24px', fontFamily: FONT }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block', background: '#fff0ed', color: '#e8533a',
            fontSize: '12px', fontWeight: '700', padding: '5px 14px',
            borderRadius: '6px', letterSpacing: '0.07em', textTransform: 'uppercase',
            marginBottom: '20px', border: '1px solid #fbc8be', fontFamily: FONT,
          }}>Platform</div>
          <h2 style={{
            fontFamily: FONT, fontSize: 'clamp(30px,3.8vw,52px)',
            fontWeight: '900', color: '#1a1814', letterSpacing: '-0.025em', marginBottom: '16px',
          }}>
            Everything you need to switch careers{' '}
            <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#7a7168' }}>with confidence.</span>
          </h2>
          <p style={{ color: '#7a7168', fontSize: '17px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65, fontFamily: FONT }}>
            Three engines working together so you never make a blind career move.
          </p>
        </div>

        {/* Tab pills — text only, no icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '52px' }}>
          {FEATURES.map((feat, i) => {
            const isAct = i === active;
            return (
              <button
                key={feat.label}
                onClick={() => setActive(i)}
                style={{
                  fontFamily: FONT,
                  padding: '9px 24px', borderRadius: '6px', fontSize: '14px',
                  fontWeight: isAct ? '700' : '400', cursor: 'pointer',
                  border: isAct ? `1.5px solid ${feat.color}` : '1.5px solid #e8e3dc',
                  background: isAct ? feat.color + '12' : '#ffffff',
                  color: isAct ? feat.color : '#7a7168',
                  transition: 'all 0.22s ease',
                }}
              >
                {feat.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px',
            alignItems: 'center',
            background: '#151515', borderRadius: '16px', padding: '52px',
          }}
        >
          {/* Left — text */}
          <div>
            {/* Label — text only, no icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: f.color + '16', border: `1px solid ${f.borderColor}`,
              borderRadius: '6px', padding: '5px 12px', marginBottom: '22px',
            }}>
              <span style={{ color: f.color, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FONT }}>{f.label}</span>
            </div>

            <h3 style={{
              fontFamily: FONT, fontSize: 'clamp(24px,2.6vw,36px)', fontWeight: '900',
              color: '#f0ede8', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.2,
            }}>
              {f.title}
            </h3>
            <p style={{ color: 'rgba(240,237,232,0.52)', fontSize: '15px', lineHeight: 1.72, marginBottom: '28px', fontFamily: FONT }}>
              {f.desc}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {f.items.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={14} color={f.color} strokeWidth={2.5} />
                  <span style={{ color: 'rgba(240,237,232,0.72)', fontSize: '14px', fontWeight: '400', fontFamily: FONT }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — mockup */}
          <div>
            <FeatureMockup f={f} idx={active} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
