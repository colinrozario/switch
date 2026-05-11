import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';

function AnimatedNumber({ end, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, decimals]);

  return <span ref={ref}>{decimals > 0 ? val.toFixed(decimals) : Math.round(val)}</span>;
}

const STATS = [
  { icon: TrendingUp, prefix: '₹', val: 3.8, suffix: 'L', label: 'Avg annual salary increase after switch', color: '#d4ff4a', dec: 1 },
  { icon: Clock,      prefix: '',  val: 14,   suffix: ' wks', label: 'Median time to first offer in target role', color: '#6ee7b7', dec: 0 },
  { icon: Users,      prefix: '',  val: 2400, suffix: '+', label: 'Career switches planned on the platform', color: '#93c5fd', dec: 0 },
  { icon: Star,       prefix: '',  val: 94,   suffix: '%',  label: 'Users who completed their transition on schedule', color: '#f9a8d4', dec: 0 },
];

const INTEGRATIONS = [
  { name: 'LinkedIn',   color: '#0A66C2', bg: '#e8f0fe' },
  { name: 'Naukri',     color: '#FF7555', bg: '#fff1ee' },
  { name: 'GitHub',     color: '#24292e', bg: '#f5f5f5' },
  { name: 'Coursera',   color: '#0056D2', bg: '#e6eeff' },
  { name: 'Glassdoor',  color: '#0CAA41', bg: '#e6f9ee' },
  { name: 'Udemy',      color: '#A435F0', bg: '#f5e6ff' },
  { name: 'Indeed',     color: '#2164F3', bg: '#e8effe' },
  { name: 'Upgrad',     color: '#FB5046', bg: '#ffe8e7' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Input your profile', desc: 'Share your current role, salary, savings, and target domain. Takes under 5 minutes.' },
  { n: '02', title: 'Get your career diagnosis', desc: 'The AI surfaces your best-fit paths ranked by feasibility, salary delta, and transition risk.' },
  { n: '03', title: 'Build your financial bridge', desc: 'Calculate the exact savings runway you need and when you can safely resign.' },
  { n: '04', title: 'Execute your roadmap', desc: 'Follow a week-by-week plan covering upskilling, portfolio, applications, and offer negotiation.' },
];

export default function MiddleSections() {
  return (
    <>
      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" style={{ background: '#f7f8fb', padding: '120px 24px', borderTop: '1px solid #e5e7ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{
              display: 'inline-block', background: '#eff6ff', color: '#2563eb',
              fontSize: '12px', fontWeight: '700', padding: '5px 14px',
              borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '20px', border: '1px solid #bfdbfe',
            }}>How it works</div>
          <h2 style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: '900',
              color: '#1a1814', letterSpacing: '-0.025em',
            }}>
              Four steps from{' '}
              <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#7a7168' }}>stuck to switched.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '32px' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.n} style={{
                background: '#ffffff', border: '1px solid #e5e7ef',
                borderRadius: '20px', padding: '36px',
                display: 'flex', gap: '24px', alignItems: 'flex-start',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  fontSize: '36px', fontWeight: '900', color: '#0a0f1e',
                  opacity: 0.08, lineHeight: 1, fontFamily: 'var(--font-sans)', flexShrink: 0,
                }}>{step.n}</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0a0f1e', marginBottom: '10px' }}>{step.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section style={{ background: '#020d1a', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 'clamp(30px,3.8vw,50px)', fontWeight: '900',
              color: '#ffffff', letterSpacing: '-0.025em',
            }}>
              Real outcomes for real career switchers.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
            {STATS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px', padding: '32px 24px', textAlign: 'center',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: s.color + '18', border: `1px solid ${s.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <div style={{
                    fontSize: 'clamp(32px,3vw,44px)', fontWeight: '900',
                    color: s.color, letterSpacing: '-0.03em', lineHeight: 1,
                  }}>
                    {s.prefix}<AnimatedNumber end={s.val} decimals={s.dec} />{s.suffix}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '12px', lineHeight: 1.55 }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '100px 24px', borderBottom: '1px solid #e5e7ef' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: '#fef3c7', color: '#92400e',
            fontSize: '12px', fontWeight: '700', padding: '5px 14px',
            borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '20px', border: '1px solid #fde68a',
          }}>Integrations</div>
          <h2 style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: '900',
            color: '#1a1814', letterSpacing: '-0.025em', marginBottom: '16px',
          }}>
            Works with your existing career stack.
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '480px', margin: '0 auto 56px', lineHeight: 1.65 }}>
            Pull in data from the platforms you already use — no manual re-entry required.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px',
            maxWidth: '760px', margin: '0 auto',
          }}>
            {INTEGRATIONS.map(int => (
              <div key={int.name} style={{
                background: int.bg, borderRadius: '14px', padding: '22px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: int.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ color: '#fff', fontWeight: '900', fontSize: '14px' }}>
                    {int.name[0]}
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{int.name}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '32px' }}>
            + resume parsers, financial planners, and learning platforms
          </p>
        </div>
      </section>
    </>
  );
}
