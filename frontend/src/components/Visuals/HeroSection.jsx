import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import ParticleGlobe from './ParticleGlobe';

const btn = {
  neon: {
    background: '#d4ff4a', color: '#0a1a00', border: 'none',
    padding: '14px 28px', borderRadius: '99px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', display: 'flex',
    alignItems: 'center', gap: '8px', transition: 'all 0.22s ease',
    boxShadow: '0 0 28px rgba(212,255,74,0.22)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(255,255,255,0.13)', padding: '14px 28px',
    borderRadius: '99px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.22s ease',
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg,#020d1a 0%,#04132b 55%,#061929 100%)',
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '160px 24px 120px', overflow: 'hidden',
    }}>

      {/* dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)',
        backgroundSize: '30px 30px', pointerEvents: 'none',
      }} />

      {/* bottom glow */}
      <div style={{
        position: 'absolute', bottom: '-160px', left: '50%',
        transform: 'translateX(-50%)', width: '900px', height: '400px',
        background: 'radial-gradient(ellipse,rgba(37,99,235,0.18) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Globe — right side */}
      <div style={{
        position: 'absolute', right: '-60px', top: '50%',
        transform: 'translateY(-50%)', opacity: 0.9, pointerEvents: 'none',
      }}>
        <ParticleGlobe size={520} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: '99px', padding: '5px 14px 5px 7px', marginBottom: '32px',
          }}
        >
          <span style={{
            background: '#d4ff4a', color: '#0a1a00', fontSize: '10px',
            fontWeight: '800', padding: '3px 9px', borderRadius: '99px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>NEW</span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: '500' }}>
            Simulator v2 — model your entire career switch
          </span>
          <ChevronRight size={13} color="rgba(255,255,255,0.35)" />
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 'clamp(42px,6.2vw,82px)', lineHeight: 1.06,
          fontWeight: '400', color: '#ffffff',
          letterSpacing: '-0.02em', marginBottom: '26px',
        }}>
          Handle everything that happens{' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(130deg,#d4ff4a 0%,#7eff85 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            before you switch.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 'clamp(16px,1.7vw,19px)', color: 'rgba(255,255,255,0.58)',
          maxWidth: '600px', margin: '0 auto 44px', lineHeight: 1.7, fontWeight: '400',
        }}>
          AI-powered career assessment, financial runway planning, and a week-by-week execution roadmap — built around your real constraints.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={btn.neon}
            onClick={() => navigate('/diagnosis')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(212,255,74,0.38)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 28px rgba(212,255,74,0.22)'; }}
          >
            Analyze My Profile <ArrowRight size={16} />
          </button>
          <button
            style={btn.ghost}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          >
            See how it works
          </button>
        </div>
      </motion.div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: '80px', width: '100%', maxWidth: '1080px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '22px', padding: '3px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg,#0e1c2e 0%,#08111f 100%)',
          borderRadius: '19px', overflow: 'hidden',
        }}>
          {/* Window bar */}
          <div style={{
            padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, height: '26px', background: 'rgba(255,255,255,0.05)',
              borderRadius: '6px', margin: '0 16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
                switch.career — Career Intelligence Dashboard
              </span>
            </div>
          </div>

          {/* Dashboard body */}
          <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {/* Tabs row */}
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: '4px', marginBottom: '6px' }}>
              {['Assessment','Bridge Plan','Roadmap','Simulator'].map((tab, i) => (
                <div key={tab} style={{
                  padding: '7px 15px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: i === 0 ? '700' : '500', cursor: 'pointer',
                  background: i === 0 ? 'rgba(212,255,74,0.14)' : 'rgba(255,255,255,0.04)',
                  border: i === 0 ? '1px solid rgba(212,255,74,0.28)' : '1px solid transparent',
                  color: i === 0 ? '#d4ff4a' : 'rgba(255,255,255,0.35)',
                }}>{tab}</div>
              ))}
            </div>

            {/* Stat cards */}
            {[
              { label: 'Career Match Score', val: '94/100', sub: 'PM → Data PM', c: '#d4ff4a' },
              { label: 'Financial Runway',   val: '8.5 mo', sub: '₹2.1L buffer', c: '#6ee7b7' },
              { label: 'Salary Delta',       val: '+₹3.2L', sub: 'Break-even: M14', c: '#93c5fd' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '18px',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: '600' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: s.c, letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}

            {/* Progress bar card */}
            <div style={{
              gridColumn: 'span 3', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', fontWeight: '700' }}>TRANSITION PROGRESS</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Assess','Upskill','Portfolio','Apply','Negotiate','Switch'].map((s, i) => (
                  <div key={s} style={{ flex: 1 }}>
                    <div style={{
                      height: '6px', borderRadius: '99px',
                      background: i < 2 ? '#d4ff4a' : i === 2 ? 'rgba(212,255,74,0.4)' : 'rgba(255,255,255,0.08)',
                    }} />
                    <div style={{ fontSize: '10px', color: i < 2 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', marginTop: '6px' }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
