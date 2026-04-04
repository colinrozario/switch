import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const steps = [
        { path: '/diagnosis', label: 'Diagnosis' },
        { path: '/options', label: 'Options' },
        { path: '/bridge', label: 'Bridge' },
        { path: '/roadmap', label: 'Roadmap' },
        { path: '/simulator', label: 'Simulator' }
    ];

    const isInternalPage = steps.some(step => step.path === currentPath);

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '72px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
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
                    fontSize: '24px',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px' }} />
                    switch.
                </NavLink>

                {/* Step Navigation (Visible on internal pages) */}
                {isInternalPage && (
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        {steps.map((step, index) => {
                            const isActive = step.path === currentPath;
                            const isPast = steps.findIndex(s => s.path === currentPath) > index;
                            
                            return (
                                <div key={step.path} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: isActive ? '700' : '500',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}>
                                        {step.label}
                                        {isActive && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-12px',
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'var(--color-primary)',
                                                borderRadius: '99px'
                                            }} />
                                        )}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-border-strong)' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Left/Right Balance */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {!isInternalPage && (
                        <div style={{ display: 'flex', gap: '32px', marginRight: '32px' }}>
                            {['How it works', 'Simulations', 'Security'].map((item) => (
                                <a key={item} href="#" style={{
                                    fontSize: '14px',
                                    color: 'var(--color-text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    {item}
                                </a>
                            ))}
                        </div>
                    )}
                    <NavLink to="/diagnosis" style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {isInternalPage ? 'Exit Flow' : 'Get Started'}
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
