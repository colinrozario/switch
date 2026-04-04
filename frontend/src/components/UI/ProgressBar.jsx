import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, label }) => {
    const progress = (current / total) * 100;

    return (
        <div style={{ width: '100%', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    {label || `Step ${current} / ${total}`}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
                    {Math.round(progress)}%
                </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--color-surface)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '99px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
