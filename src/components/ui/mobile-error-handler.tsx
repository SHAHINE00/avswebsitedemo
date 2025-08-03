import React from 'react';

interface MobileErrorHandlerProps {
  error?: Error;
  onRetry?: () => void;
}

export const MobileErrorHandler: React.FC<MobileErrorHandlerProps> = ({ error, onRetry }) => {
  // Early return with simple fallback if React is not available
  if (typeof React === 'undefined' || React === null) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        background: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h3>Une erreur s'est produite</h3>
          <p>Veuillez rafraîchir la page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Rafraîchir
          </button>
        </div>
      </div>
    );
  }

  // Simple component without hooks if React is available but hooks might not be
  if (!React.useState || !React.useEffect) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h3>Erreur de chargement</h3>
        <p>Les composants React ne sont pas entièrement chargés.</p>
        <button onClick={() => window.location.reload()}>
          Rafraîchir la page
        </button>
      </div>
    );
  }

  // Use hooks safely
  let retryCount, setRetryCount;
  try {
    [retryCount, setRetryCount] = React.useState(0);
  } catch (e) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Erreur de rendu. Rafraîchissez la page.
      </div>
    );
  }

  const handleRetry = () => {
    try {
      setRetryCount(retryCount + 1);
      if (onRetry) {
        onRetry();
      } else {
        window.location.reload();
      }
    } catch (e) {
      window.location.reload();
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h3>Erreur inattendue</h3>
        <p>Une erreur s'est produite lors du chargement.</p>
        {error && process.env.NODE_ENV === 'development' && (
          <details style={{ margin: '10px 0', textAlign: 'left' }}>
            <summary>Détails (dev only)</summary>
            <pre style={{ fontSize: '10px', overflow: 'auto' }}>
              {error.stack}
            </pre>
          </details>
        )}
        <button 
          onClick={handleRetry}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Réessayer ({retryCount + 1})
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Rafraîchir
        </button>
      </div>
    </div>
  );
};