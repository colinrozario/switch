import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total }) => {
    const progress = (current / total) * 100;

    return (
        <div className="w-full flex items-center gap-4 mb-8">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-black rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <span className="text-sm font-semibold text-gray-500">
                Step {current} of {total}
            </span>
        </div>
    );
};

export default ProgressBar;
