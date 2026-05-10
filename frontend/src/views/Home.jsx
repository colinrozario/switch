import React from 'react';
import HeroSection from '../components/Visuals/HeroSection';
import FeaturesSection from '../components/Visuals/FeaturesSection';
import MiddleSections from '../components/Visuals/MiddleSections';
import PricingAndFooter from '../components/Visuals/PricingAndFooter';

/* ── Ticker / social-proof bar ─────────────────────────────────── */
const TICKER_ITEMS = [
  '✦ Planned 2,400+ career switches',
  '✦ Avg ₹3.8L salary increase achieved',
  '✦ 14-week median time to first offer',
  '✦ 94% on-schedule completion rate',
  '✦ Trusted by engineers, analysts & PMs',
  '✦ No credit card required to start',
];

function SocialProofTicker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      background: '#d4ff4a',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      padding: '14px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'inline-flex',
        gap: '64px',
        animation: 'tickerScroll 28s linear infinite',
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#0a1a00',
            letterSpacing: '0.01em',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── AI Intelligence teaser section ───────────────────────────── */
function IntelligenceSection() {
  const queries = [
    { q: 'What career paths match a 6-year backend engineer?', a: 'Engineering Manager, Solutions Architect, Technical PM — ranked by fit.' },
    { q: 'How much runway do I need before I can resign safely?', a: 'With ₹4.8L saved and ₹42,000/mo burn, you have 8.5 months of runway.' },
    { q: 'Which skills should I prioritize in the next 90 days?', a: 'SQL proficiency, stakeholder communication, and a PM portfolio project.' },
  ];

  return (
    <section style={{
      background: '#ffffff',
      padding: '120px 24px',
      borderTop: '1px solid #e5e7ef',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

          {/* Left text */}
          <div>
            <div style={{
              display: 'inline-block', background: '#fdf4ff', color: '#7c3aed',
              fontSize: '12px', fontWeight: '700', padding: '5px 14px',
              borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '20px', border: '1px solid #e9d5ff',
            }}>AI Intelligence</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(28px,3.2vw,46px)', fontWeight: '400',
              color: '#0a0f1e', letterSpacing: '-0.025em',
              marginBottom: '20px', lineHeight: 1.2,
            }}>
              Ask it anything about your career switch.
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
              Our AI understands financial constraints, hiring market realities, and skill adjacencies — not just job titles. Get answers grounded in your actual situation.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Context-aware career guidance', 'Answers rooted in your real data', 'No generic templates or boilerplate', 'Honest risk and timeline assessments'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }} />
                  <span style={{ color: '#374151', fontSize: '15px' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Q&A cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {queries.map((item, i) => (
              <div key={i} style={{
                background: i === 1 ? '#020d1a' : '#f7f8fb',
                border: `1px solid ${i === 1 ? 'rgba(139,92,246,0.3)' : '#e5e7ef'}`,
                borderRadius: '16px', padding: '22px',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px',
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                    background: '#8b5cf6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '800', marginTop: '1px',
                  }}>?</div>
                  <span style={{
                    fontSize: '13px', fontWeight: '600',
                    color: i === 1 ? 'rgba(255,255,255,0.85)' : '#374151',
                    lineHeight: 1.5,
                  }}>{item.q}</span>
                </div>
                <div style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  paddingLeft: '30px',
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: i === 1 ? 'rgba(255,255,255,0.5)' : '#9ca3af',
                    lineHeight: 1.55,
                  }}>{item.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Assembled Home page ───────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <HeroSection />
      <SocialProofTicker />
      <FeaturesSection />
      <IntelligenceSection />
      <MiddleSections />
      <PricingAndFooter />
    </div>
  );
}
