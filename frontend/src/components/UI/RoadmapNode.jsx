import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ChevronUp, Clock, Zap, BookOpen,
    Code2, AlertCircle, RefreshCcw, IndianRupee,
    ExternalLink, Award, CheckSquare, Wrench
} from 'lucide-react';
import SkillTimeline from './SkillTimeline';

const PHASE_COLORS = [
    { accent: '#2563EB', light: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB' },
    { accent: '#7C3AED', light: '#F5F3FF', border: '#DDD6FE', dot: '#7C3AED' },
    { accent: '#059669', light: '#ECFDF5', border: '#A7F3D0', dot: '#059669' },
    { accent: '#D97706', light: '#FFFBEB', border: '#FDE68A', dot: '#D97706' },
];

const SectionHeader = ({ icon: Icon, label, color }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
        letterSpacing: '0.08em', color, marginBottom: '16px',
    }}>
        <Icon size={14} />
        {label}
    </div>
);

const Tag = ({ children, color = '#E2E8F0', textColor = '#475569' }) => (
    <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
        background: color, color: textColor,
        fontSize: '11px', fontWeight: '700',
    }}>
        {children}
    </span>
);

const RoadmapNode = ({ phase, phaseIndex, isLast }) => {
    const [expanded, setExpanded] = useState(phaseIndex === 0);
    const [activeSection, setActiveSection] = useState('skills');

    const color = PHASE_COLORS[phaseIndex % PHASE_COLORS.length];
    const totalWeeks = phase.duration_weeks || 8;
    const totalCost = phase.estimated_cost_inr || 0;
    const hasSkills = phase.skills && phase.skills.length > 0;
    const hasProjects = phase.projects && phase.projects.length > 0;
    const hasCourses = phase.courses && phase.courses.length > 0;

    const sections = [
        { id: 'skills', label: 'Skills', icon: Zap, show: hasSkills },
        { id: 'projects', label: 'Projects', icon: Code2, show: hasProjects },
        { id: 'courses', label: 'Courses', icon: BookOpen, show: hasCourses },
    ].filter(s => s.show);

    return (
        <div style={{ position: 'relative', display: 'flex', gap: '0' }}>
            {/* Left connector rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', flexShrink: 0 }}>
                {/* Phase dot */}
                <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: color.dot, border: '3px solid white',
                    boxShadow: `0 0 0 3px ${color.border}`,
                    flexShrink: 0, marginTop: '28px', zIndex: 2,
                }} />
                {/* Vertical line */}
                {!isLast && (
                    <div style={{
                        flex: 1, width: '2px',
                        background: `linear-gradient(to bottom, ${color.border}, #F1F5F9)`,
                        marginTop: '8px',
                    }} />
                )}
            </div>

            {/* Phase card */}
            <div style={{ flex: 1, paddingBottom: isLast ? '0' : '48px', paddingLeft: '16px' }}>
                {/* Card Header */}
                <div
                    onClick={() => setExpanded(e => !e)}
                    style={{
                        background: '#FFFFFF',
                        border: `1px solid ${expanded ? color.border : '#E2E8F0'}`,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: expanded ? `0 4px 20px ${color.border}` : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Phase header bar */}
                    <div style={{
                        background: expanded ? color.light : '#F8FAFC',
                        borderBottom: `1px solid ${expanded ? color.border : '#F1F5F9'}`,
                        padding: '24px 28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                                    letterSpacing: '0.08em', color: color.accent,
                                    background: color.light, border: `1px solid ${color.border}`,
                                    padding: '2px 10px', borderRadius: '99px',
                                }}>
                                    Phase {phase.phase_number}
                                </span>
                                {totalCost > 0 && (
                                    <span style={{
                                        fontSize: '11px', fontWeight: '700', color: '#059669',
                                        background: '#ECFDF5', border: '1px solid #A7F3D0',
                                        padding: '2px 10px', borderRadius: '99px',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                        <IndianRupee size={10} />
                                        {totalCost.toLocaleString('en-IN')} course budget
                                    </span>
                                )}
                            </div>
                            <h3 style={{
                                fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em',
                                color: '#0F172A', margin: 0,
                            }}>
                                {phase.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748B', fontWeight: '500', margin: 0, maxWidth: '640px' }}>
                                {phase.goal}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                            {/* Meta stats */}
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: color.accent, lineHeight: 1 }}>
                                        {totalWeeks}
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>weeks</div>
                                </div>
                                <div style={{ width: '1px', background: '#E2E8F0' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '900', color: color.accent, lineHeight: 1 }}>
                                        {phase.weekly_hours || 10}
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>hrs/wk</div>
                                </div>
                            </div>
                            {/* Expand toggle */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '12px', fontWeight: '700', color: color.accent,
                            }}>
                                {expanded ? <><ChevronUp size={16} /> Collapse</> : <><ChevronDown size={16} /> View Plan</>}
                            </div>
                        </div>
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                            >
                                {/* Section tabs */}
                                <div style={{
                                    display: 'flex', gap: '0',
                                    borderBottom: '1px solid #F1F5F9',
                                    padding: '0 28px',
                                    background: '#FAFAFA',
                                }}>
                                    {sections.map(sec => (
                                        <button
                                            key={sec.id}
                                            onClick={(e) => { e.stopPropagation(); setActiveSection(sec.id); }}
                                            style={{
                                                padding: '12px 20px',
                                                border: 'none', background: 'none',
                                                fontSize: '13px', fontWeight: '700',
                                                color: activeSection === sec.id ? color.accent : '#94A3B8',
                                                borderBottom: `2px solid ${activeSection === sec.id ? color.accent : 'transparent'}`,
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <sec.icon size={14} />
                                            {sec.label}
                                            <span style={{
                                                fontSize: '10px', fontWeight: '800',
                                                background: activeSection === sec.id ? color.light : '#F1F5F9',
                                                color: activeSection === sec.id ? color.accent : '#94A3B8',
                                                padding: '1px 7px', borderRadius: '99px',
                                            }}>
                                                {sec.id === 'skills' ? phase.skills?.length : sec.id === 'projects' ? phase.projects?.length : phase.courses?.length}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div style={{ padding: '32px 28px' }}>
                                    {/* SKILLS TAB */}
                                    {activeSection === 'skills' && hasSkills && (
                                        <div>
                                            <SectionHeader icon={Zap} label="Skill Learning Timeline" color={color.accent} />
                                            <div style={{
                                                background: '#FAFAFA', border: '1px solid #F1F5F9',
                                                borderRadius: '12px', padding: '20px', overflowX: 'auto',
                                            }}>
                                                <SkillTimeline skills={phase.skills} totalWeeks={totalWeeks} />
                                            </div>

                                            {/* Skill details */}
                                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {phase.skills.map((skill, si) => (
                                                    <div key={si} style={{
                                                        padding: '16px 20px', borderRadius: '12px',
                                                        background: skill.is_blocker ? color.light : '#FAFAFA',
                                                        border: `1px solid ${skill.is_blocker ? color.border : '#F1F5F9'}`,
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                {skill.is_blocker && (
                                                                    <span style={{
                                                                        fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
                                                                        background: color.accent, color: '#fff',
                                                                        padding: '2px 8px', borderRadius: '99px',
                                                                    }}>Required</span>
                                                                )}
                                                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{skill.name}</span>
                                                            </div>
                                                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                                                                Week {skill.week_start}–{skill.week_end}
                                                            </span>
                                                        </div>
                                                        {skill.why_essential && (
                                                            <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', marginBottom: '10px', lineHeight: 1.5 }}>
                                                                {skill.why_essential}
                                                            </p>
                                                        )}
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {skill.free_resource && (
                                                                <Tag color='#ECFDF5' textColor='#065F46'>📖 {skill.free_resource}</Tag>
                                                            )}
                                                            {skill.paid_resource && (
                                                                <Tag color='#EFF6FF' textColor='#1D4ED8'>💳 {skill.paid_resource}</Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* PROJECTS TAB */}
                                    {activeSection === 'projects' && hasProjects && (
                                        <div>
                                            <SectionHeader icon={Code2} label="Portfolio Projects" color={color.accent} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {phase.projects.map((proj, pi) => (
                                                    <div key={pi} style={{
                                                        border: '1px solid #E2E8F0', borderRadius: '16px',
                                                        overflow: 'hidden',
                                                    }}>
                                                        <div style={{
                                                            background: '#0F172A', padding: '16px 20px',
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <Code2 size={16} color='#94A3B8' />
                                                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>{proj.name}</span>
                                                            </div>
                                                            {proj.difficulty && (
                                                                <span style={{
                                                                    fontSize: '11px', fontWeight: '700',
                                                                    color: proj.difficulty === 'Advanced' ? '#FCA5A5' : proj.difficulty === 'Intermediate' ? '#FDE68A' : '#A7F3D0',
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    padding: '3px 10px', borderRadius: '99px',
                                                                }}>
                                                                    {proj.difficulty}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ padding: '20px' }}>
                                                            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, fontWeight: '500', marginBottom: '16px' }}>
                                                                {proj.description}
                                                            </p>
                                                            {proj.tech_stack && proj.tech_stack.length > 0 && (
                                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                                                    {proj.tech_stack.map((t, ti) => (
                                                                        <Tag key={ti} color='#F1F5F9' textColor='#334155'>
                                                                            <Wrench size={10} style={{ display: 'inline', marginRight: '4px' }} />{t}
                                                                        </Tag>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {proj.outcome && (
                                                                <div style={{
                                                                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                                                                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                                                                    borderRadius: '10px', padding: '12px 16px',
                                                                }}>
                                                                    <CheckSquare size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                                                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#065F46', lineHeight: 1.5 }}>
                                                                        <strong>Outcome:</strong> {proj.outcome}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* COURSES TAB */}
                                    {activeSection === 'courses' && hasCourses && (
                                        <div>
                                            <SectionHeader icon={BookOpen} label="Courses & Certifications" color={color.accent} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {phase.courses.map((course, ci) => {
                                                    const isFree = course.cost_inr === 0;
                                                    const isCert = course.is_certification;
                                                    const isMust = course.priority === 'MUST-DO';
                                                    return (
                                                        <div key={ci} style={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            padding: '16px 20px', borderRadius: '12px',
                                                            background: isMust ? (isFree ? '#ECFDF5' : '#EFF6FF') : '#FAFAFA',
                                                            border: `1px solid ${isMust ? (isFree ? '#A7F3D0' : '#BFDBFE') : '#F1F5F9'}`,
                                                        }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                    {isCert && <Award size={14} style={{ color: '#D97706' }} />}
                                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{course.name}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{course.platform}</span>
                                                                    {course.duration_weeks > 0 && (
                                                                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>· {course.duration_weeks}w</span>
                                                                    )}
                                                                    {isMust && (
                                                                        <Tag color={isFree ? '#DCFCE7' : '#DBEAFE'} textColor={isFree ? '#166534' : '#1E40AF'}>
                                                                            {isMust ? '★ Must-Do' : 'Recommended'}
                                                                        </Tag>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '16px', fontWeight: '800',
                                                                color: isFree ? '#059669' : '#0F172A',
                                                                flexShrink: 0, minWidth: '80px', textAlign: 'right',
                                                            }}>
                                                                {isFree ? 'FREE' : `₹${course.cost_inr.toLocaleString('en-IN')}`}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Phase cost total */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px',
                                                    padding: '12px 20px', borderTop: '2px solid #F1F5F9', marginTop: '4px',
                                                }}>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Phase Course Budget:</span>
                                                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>
                                                        ₹{(phase.estimated_cost_inr || 0).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Failure / Fallback — always shown */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '28px' }}>
                                        {phase.failure_trigger && (
                                            <div style={{
                                                padding: '20px', background: '#FEF2F2',
                                                border: '1px solid #FEE2E2', borderRadius: '14px',
                                            }}>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                                                    <AlertCircle size={16} style={{ color: '#B91C1C' }} />
                                                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Failure Trigger
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
                                                    {phase.failure_trigger}
                                                </p>
                                            </div>
                                        )}
                                        {phase.fallback_action && (
                                            <div style={{
                                                padding: '20px', background: '#FFFBEB',
                                                border: '1px solid #FEF3C7', borderRadius: '14px',
                                            }}>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                                                    <RefreshCcw size={16} style={{ color: '#B45309' }} />
                                                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Fallback Action
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', lineHeight: 1.5, margin: 0 }}>
                                                    {phase.fallback_action}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RoadmapNode;
