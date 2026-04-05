import React from 'react';

const Input = ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    name, 
    icon: Icon, 
    required = false, 
    isTextArea = false,
    status = null, // 'inferred', 'required'
    statusLabel = null 
}) => {
    const inputStyles = {
        width: '100%',
        padding: '12px 16px',
        paddingLeft: Icon ? '40px' : '16px',
        borderRadius: 'var(--radius-md)',
        border: status === 'required' ? '2px solid #EF4444' : (status === 'inferred' ? '2px solid #F59E0B' : '1px solid var(--color-border)'),
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: status === 'required' ? '#FEF2F2' : (status === 'inferred' ? '#FFFBEB' : '#FFFFFF'),
        color: 'var(--color-text)',
        caretColor: 'var(--color-primary)',
        boxShadow: status ? 'none' : 'var(--shadow-sm)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: '18px' }}>
                {label && (
                    <label style={{ fontSize: '13px', fontWeight: '800', color: status === 'required' ? '#B91C1C' : (status === 'inferred' ? '#92400E' : 'var(--color-text-secondary)') }}>
                        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
                    </label>
                )}
                {statusLabel && (
                    <span style={{ 
                        fontSize: '10px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        color: status === 'required' ? '#EF4444' : '#D97706'
                    }}>
                        {statusLabel}
                    </span>
                )}
            </div>
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
