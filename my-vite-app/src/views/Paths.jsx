import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { getMockPaths } from '../services/mockData';
import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const Paths = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPath, setSelectedPath] = useState(null);

    useEffect(() => {
        // Simulate AI "Processing"
        setTimeout(() => {
            setPaths(getMockPaths());
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold">Analyzing your profile...</h3>
                <p className="text-gray-500">Calculating transition risks and salary bridges.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-6 h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h2 className="text-3xl font-bold mb-2">Likely Feasible Paths</h2>
                <p className="text-gray-500">Based on your constraints, these 3 roles maximize safety and income continuity.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-1">
                {paths.map((path, index) => (
                    <Card
                        key={path.id}
                        onClick={() => setSelectedPath(path)}
                        className={`relative border-2 ${selectedPath?.id === path.id ? 'border-black' : 'border-transparent'}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full flex flex-col"
                        >
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit ${path.color}`}>
                                {path.riskLabel}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                            <div className="flex flex-col gap-1 mb-4 text-sm text-gray-500">
                                {path.matchParams.map((param, i) => (
                                    <span key={i} className="flex items-center gap-1">
                                        • {param}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mb-6 flex-1">
                                {path.description}
                            </p>

                            <div className="bg-gray-50 p-3 rounded-xl mt-auto">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Estimated Bridge</div>
                                <div className="font-mono text-sm font-semibold">{path.salaryBridge}</div>
                            </div>
                        </motion.div>

                        {selectedPath?.id === path.id && (
                            <div className="absolute top-[-10px] right-[-10px] bg-black text-white rounded-full p-1">
                                <CheckCircle size={20} />
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                    disabled={!selectedPath}
                    onClick={() => navigate('/roadmap')}
                >
                    Generate Roadmap for {selectedPath ? selectedPath.title : '...'} <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default Paths;
