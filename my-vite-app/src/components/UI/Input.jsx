import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, icon: Icon, required = false }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingLeft: Icon ? '44px' : '16px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        backgroundColor: '#FAFAFA',
                    }}
                    className="focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
                />
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;
