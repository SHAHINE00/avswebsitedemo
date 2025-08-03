
import React from 'react';

// Safe error fallback that doesn't use any React hooks
const SafeErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ error, onRetry }) => {
  // Don't use any React hooks here - pure component
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Fallback retry mechanism
      try {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } catch (e) {
        console.error('Retry failed:', e);
      }
    }
  };

  // Use inline styles to avoid any dependency issues
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <span style={{ color: '#dc2626', fontSize: '24px' }}>⚠</span>
        </div>
        
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Erreur de chargement
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          Une erreur s'est produite lors du chargement de l'application. 
          Veuillez rafraîchir la page.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={{
            textAlign: 'left',
            backgroundColor: '#f3f4f6',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Détails de l'erreur (dev only)
            </summary>
            <pre style={{
              marginTop: '8px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontSize: '10px'
            }}>
              {error.stack}
            </pre>
          </details>
        )}
        
        <button
          onClick={handleRetry}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
          }}
        >
          Rafraîchir la page
        </button>
      </div>
    </div>
  );
};

export default SafeErrorFallback;
