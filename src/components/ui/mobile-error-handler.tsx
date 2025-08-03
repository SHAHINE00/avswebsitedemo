
import { useState } from 'react';
import SafeComponentWrapper from '@/components/ui/SafeComponentWrapper';

interface MobileErrorHandlerProps {
  error?: Error;
  onRetry?: () => void;
}

const MobileErrorHandlerCore: React.FC<MobileErrorHandlerProps> = ({ error, onRetry }) => {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

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
          backgroundColor: '#ffc107',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '24px'
        }}>
          ⚠️
        </div>
        
        <h2 style={{ 
          color: '#dc3545', 
          marginBottom: '16px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Erreur de chargement
        </h2>
        
        <p style={{ 
          marginBottom: '20px', 
          color: '#6c757d',
          lineHeight: '1.5'
        }}>
          Une erreur s'est produite lors du chargement de l'application. 
          Veuillez réessayer ou rafraîchir la page.
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <details style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'left'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Détails de l'erreur
            </summary>
            <pre style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#dc3545',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.stack || error.message}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handleRetry}
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
            Réessayer {retryCount > 0 && `(${retryCount})`}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Rafraîchir
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileErrorHandler: React.FC<MobileErrorHandlerProps> = (props) => {
  return (
    <SafeComponentWrapper
      componentName="MobileErrorHandler"
      fallback={
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
          <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Erreur critique</h2>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>
            L'application n'a pas pu se charger correctement.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Rafraîchir la page
          </button>
        </div>
      }
    >
      <MobileErrorHandlerCore {...props} />
    </SafeComponentWrapper>
  );
};

export default MobileErrorHandler;
