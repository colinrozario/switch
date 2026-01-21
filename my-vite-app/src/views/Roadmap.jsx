import React from 'react';
import { motion } from 'framer-motion';
import { getMockPaths } from '../services/mockData';
import Button from '../components/UI/Button';
import { Download, Calendar, DollarSign, CheckSquare } from 'lucide-react';

const Roadmap = () => {
    // Ideally we pass the selected ID via context/url, for MVP we just show the first one
    const path = getMockPaths()[0];

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6 h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex justify-between items-end"
            >
                <div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Target Role</div>
                    <h2 className="text-4xl font-bold mb-2">{path.title}</h2>
                    <p className="text-gray-500 max-w-lg">{path.description}</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                    <div className="text-2xl font-bold">{path.matchParams[1].split(': ')[1]}</div>
                </div>
            </motion.div>

            <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-12 pb-12">
                {path.roadmap.map((phase, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white ${index === 0 ? 'bg-black' : 'bg-gray-300'}`} style={{ boxShadow: '0 0 0 4px white' }}></div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{phase.phase}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Calendar size={14} /> {phase.duration}
                                </div>
                                <div className="space-y-3">
                                    {phase.milestones.map((ms, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <CheckSquare size={18} className="text-gray-400 mt-0.5" />
                                            <span className="text-sm font-medium">{ms}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-64">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-2">
                                        <DollarSign size={14} /> Financial Impact
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">{phase.financialImpact}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100 flex justify-center">
                <Button>
                    <Download size={18} /> Export Full Strategic Plan (PDF)
                </Button>
            </div>
        </div>
    );
};

export default Roadmap;
