import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError('ErrorBoundary caught an error:', { error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-gray-50 rounded-lg border">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Une erreur est survenue
          </h2>
          <p className="text-gray-600 mb-4 max-w-md">
            Nous nous excusons pour ce problème technique. Veuillez actualiser la page ou réessayer plus tard.
          </p>
          <div className="space-x-2">
            <Button onClick={this.handleReset} variant="outline">
              Réessayer
            </Button>
            <Button onClick={() => {
              // Force React remount without page reload
              const event = new CustomEvent('forceRemount');
              window.dispatchEvent(event);
            }}>
              Actualiser l'interface
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-left text-sm">
              <summary className="cursor-pointer font-medium text-red-700">
                Détails de l'erreur (dev)
              </summary>
              <pre className="mt-2 text-red-600 whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;