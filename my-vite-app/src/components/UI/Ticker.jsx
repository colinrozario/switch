import React from 'react';
import { motion } from 'framer-motion';

const Ticker = ({ items, speed = 20 }) => {
    return (
        <div style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: '100%',
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}>
            <motion.div
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                animate={{ x: '-50%' }}
                transition={{
                    ease: "linear",
                    duration: speed,
                    repeat: Infinity
                }}
            >
                {/* Double the items to create seamless loop */}
                {[...items, ...items].map((item, index) => (
                    <div key={index} style={{
                        display: 'inline-block',
                        padding: '0 40px',
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'var(--color-text-secondary)',
                        opacity: 0.5
                    }}>
                        {item}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Ticker;
