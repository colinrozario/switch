import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false, style = {} }) => {
    const baseStyles = {
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        border: '1.5px solid transparent',
        ...style
    };

    const sizes = {
        sm: { padding: '8px 16px', fontSize: '13px' },
        md: { padding: '12px 24px', fontSize: '14px' },
        lg: { padding: '16px 32px', fontSize: '16px' },
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-sm)',
        },
        secondary: {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            borderColor: 'var(--color-border)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            borderColor: 'var(--color-border)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            border: 'none',
        },
        accent: {
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-sm)',
        }
    };

    const disabledStyles = {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none'
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { 
                y: -1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            } : {}}
            whileTap={!disabled ? { y: 0, scale: 0.98 } : {}}
            style={{
                ...baseStyles,
                ...sizes[size],
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
