import React from 'react';

const Section = ({ children, className = '', style = {} }) => {
    return (
        <section
            className={className}
            style={{
                padding: '80px 5%',
                maxWidth: '1440px',
                margin: '0 auto',
                ...style
            }}
        >
            {children}
        </section>
    );
};

export default Section;
