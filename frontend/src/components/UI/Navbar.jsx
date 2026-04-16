import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import useStore from '../../store/useStore';

const steps = [
    { path: '/diagnosis', label: 'Diagnosis', storeKey: null },         // always accessible
    { path: '/profile',   label: 'Profile',   storeKey: 'profileId' },
    { path: '/options',   label: 'Options',   storeKey: 'profileId' },
    { path: '/bridge',    label: 'Bridge',    storeKey: 'pathSetId' },
    { path: '/roadmap',   label: 'Roadmap',   storeKey: 'bridgeId' },
    { path: '/simulator', label: 'Simulator', storeKey: 'bridgeId' },
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const store = useStore();
    const currentPath = location.pathname;

    const isInternalPage = steps.some(step => step.path === currentPath);
    const currentIndex = steps.findIndex(s => s.path === currentPath);

    const isStepUnlocked = (step) => {
        if (!step.storeKey) return true;
        return !!store[step.storeKey];
    };

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '72px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
            zIndex: 1000,
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Brand */}
                <NavLink to="/" style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                }}>
                    <div style={{ width: '28px', height: '28px', background: 'var(--color-primary)', borderRadius: '7px' }} />
                    switch.
                </NavLink>

                {/* Step Navigation (visible on internal pages) */}
                {isInternalPage && (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {steps.map((step, index) => {
                            const isActive = step.path === currentPath;
                            const isPast = index < currentIndex;
                            const unlocked = isStepUnlocked(step);

                            return (
                                <div key={step.path} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button
                                        onClick={() => {
                                            if (unlocked) navigate(step.path);
                                        }}
                                        disabled={!unlocked}
                                        title={!unlocked ? 'Complete earlier steps first' : step.label}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            borderRadius: '99px',
                                            border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                                            background: isActive ? 'var(--color-primary)' : isPast ? '#F0FDF4' : 'transparent',
                                            color: isActive ? '#FFFFFF' : isPast ? '#16A34A' : unlocked ? 'var(--color-text-secondary)' : '#CBD5E1',
                                            fontSize: '13px',
                                            fontWeight: isActive ? '800' : '600',
                                            cursor: unlocked ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease',
                                            opacity: unlocked ? 1 : 0.5
                                        }}
                                    >
                                        {isPast && (
                                            <CheckCircle2 size={14} style={{ color: '#16A34A' }} />
                                        )}
                                        {!unlocked && !isPast && !isActive && (
                                            <Lock size={12} />
                                        )}
                                        {step.label}
                                    </button>

                                    {index < steps.length - 1 && (
                                        <div style={{
                                            width: '16px',
                                            height: '1px',
                                            background: isPast ? '#BBF7D0' : 'var(--color-border)',
                                            transition: 'all 0.3s ease'
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {!isInternalPage && (
                        <div style={{ display: 'flex', gap: '32px', marginRight: '32px' }}>
                            {['How it works', 'Simulations', 'Security'].map((item) => (
                                <a key={item} href="#" style={{
                                    fontSize: '14px',
                                    color: 'var(--color-text-secondary)',
                                    fontWeight: '500',
                                    textDecoration: 'none'
                                }}>
                                    {item}
                                </a>
                            ))}
                        </div>
                    )}
                    <NavLink to={isInternalPage ? '/' : '/diagnosis'} style={{
                        background: isInternalPage ? 'transparent' : 'var(--color-primary)',
                        color: isInternalPage ? 'var(--color-text-secondary)' : '#fff',
                        border: isInternalPage ? '1px solid var(--color-border)' : 'none',
                        padding: '9px 20px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        boxShadow: isInternalPage ? 'none' : 'var(--shadow-sm)',
                        textDecoration: 'none'
                    }}>
                        {isInternalPage ? 'Exit Flow' : 'Get Started'}
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
