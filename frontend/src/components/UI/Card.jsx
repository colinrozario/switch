import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={onClick ? { y: -5, backgroundColor: 'var(--color-surface-hover)' } : {}}
            className={`card-glass ${className}`}
            style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)', // Large radius like Bombon
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '40px',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: onClick ? 'pointer' : 'default',
                overflow: 'hidden',
                position: 'relative' // For absolute positioning children if any
            }}
        >
            {children}
        </motion.div>
    );
};

export default Card;
