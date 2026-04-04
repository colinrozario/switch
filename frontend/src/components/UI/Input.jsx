import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, icon: Icon, required = false, isTextArea = false }) => {
    const inputStyles = {
        width: '100%',
        padding: '12px 16px',
        paddingLeft: Icon ? '40px' : '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: '#FFFFFF',
        color: 'var(--color-text)',
        caretColor: 'var(--color-primary)',
        boxShadow: 'var(--shadow-sm)',
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.boxShadow = '0 0 0 4px rgba(17, 24, 39, 0.05)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'var(--color-border)';
        e.target.style.boxShadow = 'var(--shadow-sm)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
                    {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {isTextArea ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        rows={4}
                        style={{ ...inputStyles, resize: 'vertical' }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        style={inputStyles}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                )}
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: isTextArea ? '16px' : '50%',
                        transform: isTextArea ? 'none' : 'translateY(-50%)',
                        color: 'var(--color-text-secondary)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Icon size={18} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;
