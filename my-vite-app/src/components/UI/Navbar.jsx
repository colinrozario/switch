import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px', // Constrained width like a pill
            height: '64px',
            background: 'rgba(255, 255, 255, 0.1)', // Glass
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px 0 24px', // Reduced padding on right for the button
            zIndex: 1000,
        }}>
            {/* Brand */}
            <NavLink to="/" style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                letterSpacing: '-0.02em'
            }}>
                switch.
            </NavLink>

            {/* Links (Hidden on mobile? For now keep them) */}
            <div style={{ display: 'flex', gap: '24px' }}>
                {['Process', 'Pricing', 'About'].map((item) => (
                    <a key={item} href="#" style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: '500'
                    }}>
                        {item}
                    </a>
                ))}
            </div>

            {/* CTA */}
            <NavLink to="/intake" style={{
                background: 'var(--color-primary)',
                color: '#000',
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
            }}>
                Get Started
            </NavLink>
        </div>
    );
};

export default Navbar;
