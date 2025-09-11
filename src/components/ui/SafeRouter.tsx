import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

interface SafeRouterProps {
  children: React.ReactNode;
}

const SafeRouter: React.FC<SafeRouterProps> = ({ children }) => {
  // Create a fallback that shows loading when Router fails
  try {
    return <Router>{children}</Router>;
  } catch (error) {
    console.warn('Router failed during HMR, showing fallback:', error);
    
    // Simple fallback that doesn't use React hooks
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '24px'
          }}>
            🔄
          </div>
          
          <h2 style={{ 
            color: '#007bff', 
            marginBottom: '16px',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Rechargement en cours...
          </h2>
          
          <p style={{ 
            marginBottom: '20px', 
            color: '#6c757d',
            lineHeight: '1.5'
          }}>
            L'application se recharge. Veuillez patienter ou rafraîchir la page.
          </p>

          <button
            onClick={() => {
              // Force React to remount without full page reload
              const event = new CustomEvent('forceRemount');
              window.dispatchEvent(event);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    );
  }
};

export default SafeRouter;