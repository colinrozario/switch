import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, icon: Icon, required = false }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                    {label} {required && <span style={{ color: '#ff4d4d' }}>*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    style={{
                        width: '100%',
                        padding: '16px 20px',
                        paddingLeft: Icon ? '48px' : '20px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'var(--color-surface)',
                        color: '#FFF',
                        caretColor: 'var(--color-primary)'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.background = 'var(--color-surface-hover)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border)';
                        e.target.style.background = 'var(--color-surface)';
                    }}
                />
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-secondary)',
                        pointerEvents: 'none'
                    }}>
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;
