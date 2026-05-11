import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #111111 0%, #181818 55%, #111111 100%)',
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '160px 24px 120px', overflow: 'hidden',
      fontFamily: "'Lato', sans-serif",
    }}>

      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }} />

      {/* Warm bottom glow */}
      <div style={{
        position: 'absolute', bottom: '-120px', left: '50%',
        transform: 'translateX(-50%)', width: '800px', height: '380px',
        background: 'radial-gradient(ellipse, rgba(232,83,58,0.12) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />



      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 2 }}
      >
        {/* Headline */}
        <h1 style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 'clamp(42px, 6.2vw, 84px)', lineHeight: 1.06,
          fontWeight: '900', color: '#f0ede8',
          letterSpacing: '-0.03em', marginBottom: '26px',
        }}>
          Handle everything that happens{' '}
          <span style={{
            fontStyle: 'italic', fontWeight: '700',
            color: '#f0ede8',
          }}>
            before you switch.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 'clamp(16px, 1.7vw, 19px)', color: 'rgba(240,237,232,0.52)',
          maxWidth: '580px', margin: '0 auto 44px', lineHeight: 1.7, fontWeight: '400',
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
              background: '#e8533a', color: '#ffffff', border: 'none',
              padding: '14px 30px', borderRadius: '8px', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px', transition: 'all 0.22s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d44329';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,83,58,0.32)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#e8533a';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Analyze My Profile <ArrowRight size={16} />
          </button>
          <button
            style={{
              fontFamily: "'Lato', sans-serif",
              background: 'rgba(255,255,255,0.06)', color: 'rgba(240,237,232,0.8)',
              border: '1px solid rgba(255,255,255,0.12)', padding: '14px 28px',
              borderRadius: '8px', fontSize: '15px', fontWeight: '400',
              cursor: 'pointer', transition: 'all 0.22s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
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
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '3px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderRadius: '13px', overflow: 'hidden',
          fontFamily: "'Lato', sans-serif",
        }}>
          {/* Window bar */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, height: '24px', background: 'rgba(255,255,255,0.05)',
              borderRadius: '5px', margin: '0 16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', fontFamily: "'Lato', sans-serif" }}>
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
                  fontFamily: "'Lato', sans-serif",
                  background: i === 0 ? 'rgba(232,83,58,0.14)' : 'rgba(255,255,255,0.04)',
                  border: i === 0 ? '1px solid rgba(232,83,58,0.28)' : '1px solid transparent',
                  color: i === 0 ? '#e8533a' : 'rgba(255,255,255,0.3)',
                }}>{tab}</div>
              ))}
            </div>

            {/* Stat cards */}
            {[
              { label: 'Career Match Score', val: '94/100', sub: 'PM → Data PM',      c: '#e8533a' },
              { label: 'Financial Runway',   val: '8.5 mo', sub: '₹2.1L buffer',      c: '#2a9d6a' },
              { label: 'Salary Delta',       val: '+₹3.2L', sub: 'Break-even: M14',   c: '#3b6ef5' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '18px',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: s.c, letterSpacing: '-0.02em', fontFamily: "'Lato', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '4px', fontFamily: "'Lato', sans-serif" }}>{s.sub}</div>
              </div>
            ))}

            {/* Progress row */}
            <div style={{
              gridColumn: 'span 3', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '18px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px', fontWeight: '700', letterSpacing: '0.05em', fontFamily: "'Lato', sans-serif" }}>TRANSITION PROGRESS</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Assess', 'Upskill', 'Portfolio', 'Apply', 'Negotiate', 'Switch'].map((s, i) => (
                  <div key={s} style={{ flex: 1 }}>
                    <div style={{
                      height: '5px', borderRadius: '99px',
                      background: i < 2 ? '#e8533a' : i === 2 ? 'rgba(232,83,58,0.35)' : 'rgba(255,255,255,0.08)',
                    }} />
                    <div style={{ fontSize: '10px', color: i < 2 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)', marginTop: '6px', fontFamily: "'Lato', sans-serif" }}>{s}</div>
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
