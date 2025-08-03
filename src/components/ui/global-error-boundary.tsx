import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logError } from '@/utils/logger';
import { MobileErrorHandler } from '@/components/ui/mobile-error-handler';

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
    try {
      logError('Global Error Boundary caught an error:', { error, errorInfo });
      this.setState({ errorInfo });
      
      // Track mobile-specific errors
      if (typeof window !== 'undefined' && error.message) {
        if (error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('Loading CSS chunk')) {
          // This is likely a mobile network/caching issue
          logError('Mobile loading error detected:', error.message);
        }
      }
    } catch (e) {
      // Prevent error boundary from crashing
      this.setState({ errorInfo: { componentStack: 'Error boundary failed to log error' } });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use mobile-specific error handler for better mobile experience
      return (
        <MobileErrorHandler 
          error={this.state.error} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}