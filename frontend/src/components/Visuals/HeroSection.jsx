import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '160px 24px 120px', overflow: 'hidden',
      fontFamily: "'Lato', sans-serif",
    }}>

      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }} />

      {/* Green centre glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(212,255,74,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Green bottom edge glow */}
      <div style={{
        position: 'absolute', bottom: '-80px', left: '50%',
        transform: 'translateX(-50%)', width: '700px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(212,255,74,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '820px', textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,255,74,0.07)', border: '1px solid rgba(212,255,74,0.18)',
            borderRadius: '99px', padding: '6px 16px', marginBottom: '32px',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#d4ff4a', boxShadow: '0 0 8px rgba(212,255,74,0.8)',
            display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{
            color: 'rgba(212,255,74,0.8)', fontSize: '12px',
            fontWeight: '600', letterSpacing: '0.05em',
          }}>
            AI-Powered Career Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 'clamp(44px, 6.5vw, 88px)', lineHeight: 1.04,
          fontWeight: '900', color: '#f0ede8',
          letterSpacing: '-0.03em', marginBottom: '28px',
        }}>
          Handle everything that happens{' '}
          <span style={{
            fontStyle: 'italic', fontWeight: '700',
            color: '#d4ff4a',
            textShadow: '0 0 40px rgba(212,255,74,0.3)',
          }}>
            before you switch.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 'clamp(16px, 1.7vw, 19px)', color: 'rgba(240,237,232,0.45)',
          maxWidth: '560px', margin: '0 auto 44px', lineHeight: 1.72, fontWeight: '400',
        }}>
          AI-powered career assessment, financial runway planning, and a week-by-week
          execution roadmap — built around your real constraints.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/diagnosis')}
            style={{
              fontFamily: "'Lato', sans-serif",
              background: '#d4ff4a', color: '#0a1a00', border: 'none',
              padding: '14px 30px', borderRadius: '99px', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px', transition: 'all 0.22s ease',
              boxShadow: '0 0 28px rgba(212,255,74,0.18)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#c2ef30';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 36px rgba(212,255,74,0.36)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#d4ff4a';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 0 28px rgba(212,255,74,0.18)';
            }}
          >
            Analyze My Profile <ArrowRight size={16} />
          </button>
          <button
            style={{
              fontFamily: "'Lato', sans-serif",
              background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.65)',
              border: '1px solid rgba(255,255,255,0.1)', padding: '14px 28px',
              borderRadius: '99px', fontSize: '15px', fontWeight: '400',
              cursor: 'pointer', transition: 'all 0.22s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.color = 'rgba(240,237,232,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(240,237,232,0.65)';
            }}
          >
            See how it works
          </button>
        </div>
      </motion.div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: '80px', width: '100%', maxWidth: '1060px',
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '3px', position: 'relative', zIndex: 2,
          boxShadow: '0 0 60px rgba(212,255,74,0.05)',
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, #181818 0%, #131313 100%)',
          borderRadius: '13px', overflow: 'hidden',
          fontFamily: "'Lato', sans-serif",
        }}>
          {/* Window bar */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.055)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, height: '24px', background: 'rgba(255,255,255,0.045)',
              borderRadius: '5px', margin: '0 16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px' }}>
                switch.career — Career Intelligence Dashboard
              </span>
            </div>
          </div>

          {/* Dashboard body */}
          <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {/* Tabs */}
            <div style={{ gridColumn: 'span 3', display: 'flex', gap: '4px', marginBottom: '6px' }}>
              {['Assessment', 'Bridge Plan', 'Roadmap', 'Simulator'].map((tab, i) => (
                <div key={tab} style={{
                  padding: '7px 14px', borderRadius: '6px', fontSize: '12px',
                  fontWeight: i === 0 ? '700' : '400', cursor: 'pointer',
                  background: i === 0 ? 'rgba(212,255,74,0.09)' : 'rgba(255,255,255,0.03)',
                  border: i === 0 ? '1px solid rgba(212,255,74,0.22)' : '1px solid transparent',
                  color: i === 0 ? '#d4ff4a' : 'rgba(255,255,255,0.25)',
                }}>{tab}</div>
              ))}
            </div>

            {/* Stat cards */}
            {[
              { label: 'Career Match Score', val: '94/100', sub: 'PM → Data PM',    c: '#d4ff4a' },
              { label: 'Financial Runway',   val: '8.5 mo', sub: '₹2.1L buffer',    c: '#6ee7b7' },
              { label: 'Salary Delta',       val: '+₹3.2L', sub: 'Break-even: M14', c: '#93c5fd' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.055)',
                borderRadius: '10px', padding: '18px',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: s.c, letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}

            {/* Progress row */}
            <div style={{
              gridColumn: 'span 3', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.055)', borderRadius: '10px', padding: '18px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '14px', fontWeight: '700', letterSpacing: '0.05em' }}>TRANSITION PROGRESS</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Assess', 'Upskill', 'Portfolio', 'Apply', 'Negotiate', 'Switch'].map((s, i) => (
                  <div key={s} style={{ flex: 1 }}>
                    <div style={{
                      height: '4px', borderRadius: '99px',
                      background: i < 2 ? '#d4ff4a' : i === 2 ? 'rgba(212,255,74,0.22)' : 'rgba(255,255,255,0.07)',
                    }} />
                    <div style={{ fontSize: '10px', color: i < 2 ? 'rgba(212,255,74,0.65)' : 'rgba(255,255,255,0.18)', marginTop: '6px' }}>{s}</div>
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
