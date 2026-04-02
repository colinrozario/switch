import React from 'react';

const MainContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default MainContainer;
