import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter', price: '₹599', period: '/month',
    desc: 'Profile analysis and bridge calculation for solo career explorers.',
    features: ['Career fit assessment', 'Top 3 path recommendations', 'Financial runway calculator', 'Basic roadmap outline'],
    cta: 'Get Started', highlight: false,
  },
  {
    name: 'Pro', price: '₹699', period: '/month',
    desc: 'Everything in Starter plus the full simulator and live dashboard.',
    features: ['Everything in Starter', 'Full career simulator', 'Live income dashboard', 'Scenario stress-testing', 'Priority email support'],
    cta: 'Start Free Trial', highlight: true,
  },
  {
    name: 'Advisory', price: '₹1,999', period: '/month',
    desc: 'Pro + a dedicated career advisor who reviews your roadmap personally.',
    features: ['Everything in Pro', '2 advisor sessions/month', 'Personalized roadmap review', 'Offer negotiation coaching', 'Slack access to advisor'],
    cta: 'Talk to Sales', highlight: false,
  },
];

const FOOTER_LINKS = {
  Platform:  ['Career Diagnosis', 'Bridge Planner', 'Roadmap Builder', 'Simulator', 'Pricing'],
  Resources: ['How it Works', 'Blog', 'Case Studies', 'Prompt Guide', 'Changelog'],
  Company:   ['About', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'],
};

export default function PricingAndFooter() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── PRICING ──────────────────────────────────── */}
      <section id="pricing" style={{ background: '#f7f8fb', padding: '120px 24px', borderTop: '1px solid #e5e7ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block', background: '#f5f3ff', color: '#7c3aed',
              fontSize: '12px', fontWeight: '700', padding: '5px 14px',
              borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '20px', border: '1px solid #ddd6fe',
            }}>Pricing</div>
            <h2 style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: '900',
              color: '#1a1814', letterSpacing: '-0.025em', marginBottom: '16px',
            }}>
              Simple pricing,{' '}
              <span style={{ fontStyle: 'italic', color: '#6b7280' }}>no surprises.</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>
              Start free. Upgrade when you are ready to go deeper.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', alignItems: 'start' }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? '#020d1a' : '#ffffff',
                border: plan.highlight ? '2px solid #d4ff4a' : '1px solid #e5e7ef',
                borderRadius: '24px', padding: '36px',
                position: 'relative', overflow: 'hidden',
                boxShadow: plan.highlight ? '0 0 60px rgba(212,255,74,0.12)' : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: '#d4ff4a', color: '#0a1a00',
                    fontSize: '10px', fontWeight: '800', padding: '3px 10px',
                    borderRadius: '99px', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>Most Popular</div>
                )}
                <div style={{
                  fontSize: '13px', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#9ca3af',
                  marginBottom: '16px',
                }}>{plan.name}</div>
                <div style={{
                  fontSize: '42px', fontWeight: '900', letterSpacing: '-0.04em',
                  color: plan.highlight ? '#d4ff4a' : '#0a0f1e', lineHeight: 1,
                }}>
                  {plan.price}
                  <span style={{ fontSize: '15px', fontWeight: '500', color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}>
                    {plan.period}
                  </span>
                </div>
                <p style={{
                  fontSize: '14px', lineHeight: 1.6, marginTop: '14px', marginBottom: '28px',
                  color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#6b7280',
                }}>{plan.desc}</p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <CheckCircle size={15} color={plan.highlight ? '#d4ff4a' : '#22c55e'} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span style={{ fontSize: '14px', color: plan.highlight ? 'rgba(255,255,255,0.72)' : '#374151' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/diagnosis')}
                  style={{
                    width: '100%', padding: '13px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                    border: plan.highlight ? 'none' : '1.5px solid #e5e7ef',
                    background: plan.highlight ? '#d4ff4a' : 'transparent',
                    color: plan.highlight ? '#0a1a00' : '#374151',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (plan.highlight) { e.currentTarget.style.background = '#c2ef30'; }
                    else { e.currentTarget.style.background = '#f7f8fb'; }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = plan.highlight ? '#d4ff4a' : 'transparent';
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(155deg,#020d1a 0%,#04132b 100%)',
        padding: '140px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '700px', height: '350px',
          background: 'radial-gradient(ellipse,rgba(212,255,74,0.1) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 'clamp(36px,5vw,68px)', fontWeight: '900',
            color: '#ffffff', letterSpacing: '-0.025em', marginBottom: '22px', lineHeight: 1.1,
          }}>
            Start your career switch{' '}
            <span style={{
              fontStyle: 'italic',
              color: '#f0ede8',
            }}>today.</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '18px',
            lineHeight: 1.65, marginBottom: '44px', maxWidth: '520px', margin: '0 auto 44px',
          }}>
            Join thousands of professionals who planned their switch with clarity, not anxiety.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/diagnosis')}
              style={{
                background: '#d4ff4a', color: '#0a1a00', border: 'none',
                padding: '16px 36px', borderRadius: '99px', fontSize: '16px',
                fontWeight: '800', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '8px', transition: 'all 0.22s',
                boxShadow: '0 0 40px rgba(212,255,74,0.28)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 50px rgba(212,255,74,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 40px rgba(212,255,74,0.28)'; }}
            >
              Analyze My Profile <ArrowRight size={18} />
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '20px' }}>
            No credit card required · Results in under 2 minutes
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ background: '#020d1a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '72px 24px 48px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '64px' }}>
            {/* Brand col */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'linear-gradient(135deg,#d4ff4a 0%,#7eff85 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M4 14L14 4M4 4h10v10" stroke="#0a1a00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.04em' }}>switch.</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px', marginBottom: '24px' }}>
                Plan your career switch without the financial risk. AI-powered guidance built around your real constraints.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.45)', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link cols */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <div style={{
                  fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px',
                }}>{heading}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" style={{
                        color: 'rgba(255,255,255,0.45)', fontSize: '14px',
                        textDecoration: 'none', transition: 'color 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
              © 2026 Switch Career Intelligence. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy','Terms','Cookies'].map(l => (
                <a key={l} href="#" style={{
                  color: 'rgba(255,255,255,0.25)', fontSize: '13px',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
