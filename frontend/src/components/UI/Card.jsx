import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', onClick, padding = '24px', hover = true, style = {} }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={onClick && hover ? { 
                y: -4, 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                borderColor: 'var(--color-border-strong)'
            } : {}}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`bento-card ${className}`}
            style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: padding,
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
        >
            {children}
        </motion.div>
    );
};

export default Card;
