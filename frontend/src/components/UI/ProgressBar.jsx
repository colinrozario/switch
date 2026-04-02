import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total }) => {
    const progress = (current / total) * 100;

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '12px', background: 'var(--color-surface)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '99px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                Step {current} / {total}
            </span>
        </div>
    );
};

export default ProgressBar;
