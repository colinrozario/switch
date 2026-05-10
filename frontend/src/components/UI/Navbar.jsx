import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

const steps = [
  { path: '/diagnosis', label: 'Diagnosis', storeKey: null },
  { path: '/profile',   label: 'Profile',   storeKey: 'profileId' },
  { path: '/options',   label: 'Options',   storeKey: 'profileId' },
  { path: '/bridge',    label: 'Bridge',    storeKey: 'pathSetId' },
  { path: '/roadmap',   label: 'Roadmap',   storeKey: 'bridgeId' },
  { path: '/simulator', label: 'Simulator', storeKey: 'bridgeId' },
];

const NAV_LINKS = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Pricing',      href: '#pricing' },
];

export default function Navbar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const store      = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath  = location.pathname;
  const isHome       = currentPath === '/';
  const isInternalPage = steps.some(s => s.path === currentPath);
  const currentIndex = steps.findIndex(s => s.path === currentPath);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isStepUnlocked = (step) => {
    if (!step.storeKey) return true;
    return !!store[step.storeKey];
  };

  /* ── shared style atoms ── */
  const navBg = isHome
    ? scrolled
      ? 'rgba(2,13,26,0.85)'
      : 'transparent'
    : 'rgba(255,255,255,0.92)';

  const borderColor = isHome
    ? scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'
    : 'rgba(229,231,239,0.8)';

  const logoColor   = isHome ? '#ffffff' : '#0a0f1e';
  const linkColor   = isHome ? 'rgba(255,255,255,0.65)' : '#6b7280';
  const linkHover   = isHome ? '#ffffff' : '#0a0f1e';

  return (
    <nav
      id="navbar"
      style={{
        position:          'fixed',
        top:               0,
        left:              0,
        width:             '100%',
        height:            '68px',
        background:        navBg,
        backdropFilter:    scrolled || !isHome ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
        borderBottom:      `1px solid ${borderColor}`,
        display:           'flex',
        alignItems:        'center',
        justifyContent:    'center',
        padding:           '0 32px',
        zIndex:            1000,
        transition:        'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
      }}
    >
      <div style={{
        width:          '100%',
        maxWidth:       '1200px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>

        {/* ── Brand ── */}
        <NavLink
          to="/"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '10px',
            textDecoration: 'none',
          }}
        >
          {/* Logo mark */}
          <div style={{
            width:         '32px',
            height:        '32px',
            borderRadius:  '9px',
            background:    'linear-gradient(135deg, #d4ff4a 0%, #7eff85 100%)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 14L14 4M4 4h10v10" stroke="#0a1a00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontSize:      '20px',
            fontWeight:    '800',
            color:         logoColor,
            letterSpacing: '-0.04em',
            transition:    'color 0.3s',
          }}>
            switch.
          </span>
        </NavLink>

        {/* ── Center — home nav links OR step progress ── */}
        {isInternalPage ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {steps.map((step, index) => {
              const isActive = step.path === currentPath;
              const isPast   = index < currentIndex;
              const unlocked = isStepUnlocked(step);
              return (
                <div key={step.path} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => { if (unlocked) navigate(step.path); }}
                    disabled={!unlocked}
                    title={!unlocked ? 'Complete earlier steps first' : step.label}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '6px',
                      padding:    '6px 13px',
                      borderRadius: '99px',
                      border:     isActive ? '2px solid #d4ff4a' : '2px solid transparent',
                      background: isActive ? '#d4ff4a' : isPast ? '#f0fdf4' : 'transparent',
                      color:      isActive ? '#0a1a00' : isPast ? '#16a34a' : unlocked ? '#6b7280' : '#cbd5e1',
                      fontSize:   '13px',
                      fontWeight: isActive ? '800' : '600',
                      cursor:     unlocked ? 'pointer' : 'not-allowed',
                      opacity:    unlocked ? 1 : 0.5,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isPast && <CheckCircle2 size={13} color="#16a34a" />}
                    {!unlocked && !isPast && !isActive && <Lock size={12} />}
                    {step.label}
                  </button>
                  {index < steps.length - 1 && (
                    <div style={{
                      width:      '16px',
                      height:     '1px',
                      background: isPast ? '#bbf7d0' : '#e5e7ef',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize:       '14px',
                  fontWeight:     '500',
                  color:          linkColor,
                  padding:        '6px 14px',
                  borderRadius:   '99px',
                  textDecoration: 'none',
                  transition:     'color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = linkHover;
                  e.currentTarget.style.background = isHome ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = linkColor;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {/* ── Right side CTA ── */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isInternalPage ? (
            <NavLink
              to="/"
              style={{
                fontSize:     '13px',
                fontWeight:   '600',
                color:        '#6b7280',
                padding:      '8px 18px',
                borderRadius: '99px',
                border:       '1px solid #e5e7ef',
                background:   '#fff',
                textDecoration:'none',
                transition:   'all 0.2s',
              }}
            >
              Exit Flow
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/diagnosis"
                style={{
                  fontSize:       '14px',
                  fontWeight:     '500',
                  color:          linkColor,
                  textDecoration: 'none',
                  padding:        '6px 14px',
                  transition:     'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = linkHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = linkColor; }}
              >
                Log in
              </NavLink>
              <button
                onClick={() => navigate('/diagnosis')}
                style={{
                  background:    '#d4ff4a',
                  color:         '#0a1a00',
                  border:        'none',
                  padding:       '9px 20px',
                  borderRadius:  '99px',
                  fontSize:      '14px',
                  fontWeight:    '700',
                  cursor:        'pointer',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '6px',
                  transition:    'all 0.2s ease',
                  whiteSpace:    'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#c2ef30';
                  e.currentTarget.style.transform  = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow  = '0 4px 20px rgba(212,255,74,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#d4ff4a';
                  e.currentTarget.style.transform  = 'translateY(0)';
                  e.currentTarget.style.boxShadow  = 'none';
                }}
              >
                Get Started <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
