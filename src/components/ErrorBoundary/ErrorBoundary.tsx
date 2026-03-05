import { Component, ReactNode, ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.scss';

// ============================================
// Props & State Types
// ============================================

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ============================================
// ErrorBoundary Component
// ============================================

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.content}>
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            {this.state.error && (
              <details className={styles.details}>
                <summary>Error details</summary>
                <pre className={styles.errorText}>{this.state.error.toString()}</pre>
              </details>
            )}
            <button className={styles.button} onClick={this.handleReset}>
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
