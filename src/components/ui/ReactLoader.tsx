import React from 'react';

interface ReactLoaderProps {
  children: React.ReactNode;
}

const ReactLoader: React.FC<ReactLoaderProps> = ({ children }) => {
  // Don't use any hooks here - just check if React is available
  if (typeof React === 'undefined' || React === null || !React.useState) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactLoader;