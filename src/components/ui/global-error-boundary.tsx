
import React from 'react';
import { logError } from '@/utils/logger';
import SafeErrorFallback from '@/components/ui/SafeErrorFallback';

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
      
      // Track React-specific errors
      if (error.message && (
          error.message.includes('Cannot read properties of null') ||
          error.message.includes('useState') ||
          error.message.includes('useEffect') ||
          error.message.includes('useContext'))) {
        logError('React hooks null error detected:', error.message);
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
      // Use SafeErrorFallback that doesn't use React hooks
      return (
        <SafeErrorFallback 
          error={this.state.error || undefined} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
