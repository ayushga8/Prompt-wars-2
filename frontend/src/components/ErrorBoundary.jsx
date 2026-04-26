import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            color: '#f1f5f9',
            background: '#0b1120',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#ef4444' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '500px' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
