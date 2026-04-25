import React, { useRef } from 'react';

/**
 * SkillTimeline — Gantt-style horizontal bar chart showing
 * the week-by-week learning sequence within a phase.
 */
const COLORS = {
    blocker: { bar: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    normal: { bar: '#64748B', bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
};

const SkillTimeline = ({ skills = [], totalWeeks = 8 }) => {
    if (!skills || skills.length === 0) return null;

    // Guard: clamp all week values
    const safeSkills = skills.map(s => ({
        ...s,
        week_start: Math.max(1, s.week_start || 1),
        week_end: Math.min(totalWeeks, Math.max(s.week_start || 1, s.week_end || totalWeeks)),
    }));

    const weekLabels = Array.from({ length: totalWeeks }, (_, i) => i + 1);

    return (
        <div>
            {/* Week header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${totalWeeks}, 1fr)`,
                gap: 0,
                marginBottom: '8px',
            }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Skill
                </div>
                {weekLabels.map(w => (
                    <div key={w} style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#CBD5E1',
                        textAlign: 'center',
                        paddingBottom: '4px',
                        borderBottom: '1px solid #F1F5F9',
                    }}>
                        W{w}
                    </div>
                ))}
            </div>

            {/* Skill rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {safeSkills.map((skill, idx) => {
                    const c = skill.is_blocker ? COLORS.blocker : COLORS.normal;
                    const startCol = skill.week_start;
                    const span = Math.max(1, skill.week_end - skill.week_start + 1);

                    return (
                        <div
                            key={idx}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `180px repeat(${totalWeeks}, 1fr)`,
                                alignItems: 'center',
                                gap: 0,
                            }}
                        >
                            {/* Skill label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '12px' }}>
                                {skill.is_blocker && (
                                    <div style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: '#2563EB', flexShrink: 0,
                                    }} />
                                )}
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: skill.is_blocker ? '700' : '600',
                                    color: c.text,
                                    lineHeight: 1.3,
                                }}>
                                    {skill.name}
                                </span>
                            </div>

                            {/* Timeline columns */}
                            {weekLabels.map(w => {
                                const inRange = w >= startCol && w < startCol + span;
                                const isFirst = w === startCol;
                                const isLast = w === startCol + span - 1;
                                return (
                                    <div
                                        key={w}
                                        style={{
                                            height: '22px',
                                            background: inRange ? c.bar : 'transparent',
                                            borderRadius: isFirst && isLast ? '6px' : isFirst ? '6px 0 0 6px' : isLast ? '0 6px 6px 0' : '0',
                                            opacity: inRange ? 1 : 0,
                                            margin: '0 1px',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2563EB' }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Critical / Blocker</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#64748B' }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Supporting Skill</span>
                </div>
            </div>
        </div>
    );
};

export default SkillTimeline;
