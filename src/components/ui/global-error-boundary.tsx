import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logError } from '@/utils/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError('Global Error Boundary caught an error:', { error, errorInfo });
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium text-destructive">
                    Une erreur inattendue s'est produite
                  </p>
                  <p className="text-sm text-muted-foreground">
                    L'application a rencontré un problème. Veuillez rafraîchir la page ou réessayer.
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="text-xs bg-muted p-2 rounded mt-2">
                      <summary>Détails de l'erreur (dev only)</summary>
                      <pre className="mt-2 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={this.handleRetry} size="sm" className="flex items-center gap-2">
                      <RotateCcw className="h-3 w-3" />
                      Réessayer
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      size="sm"
                    >
                      Rafraîchir la page
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}