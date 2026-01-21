import React from 'react';
import { motion } from 'framer-motion';

const AbstractShape = ({ className = '', delay = 0 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay }}
            style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #F0F2FF 0%, #E0F2FE 40%, #E8D5FF 70%, rgba(255,255,255,0) 100%)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                width: '70%',
                height: '70%',
                background: 'conic-gradient(from 180deg at 50% 50%, #C4B5FD 0deg, #A5B4FC 120deg, #F9A8D4 240deg, #C4B5FD 360deg)',
                borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                opacity: 0.6,
                filter: 'blur(40px)',
                animation: 'spin 20s linear infinite',
            }} />
            <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
        </motion.div>
    );
};

export default AbstractShape;
