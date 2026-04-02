import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseStyles = {
        padding: '16px 32px',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: 'var(--radius-pill)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#000000',
            border: 'none',
        },
        secondary: {
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.3)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            border: 'none',
            padding: '8px 16px',
        }
    };

    const disabledStyles = {
        opacity: 0.5,
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            style={{
                ...baseStyles,
                ...variants[variant],
                ...(disabled ? disabledStyles : {}),
            }}
            className={className}
        >
            {children}
        </motion.button>
    );
};
export default Button;
