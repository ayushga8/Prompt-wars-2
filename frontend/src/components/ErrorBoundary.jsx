/**
 * @module components/ErrorBoundary
 * @description React error boundary that catches unhandled component errors
 * and displays a fallback UI instead of a white screen crash.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error boundary component that wraps child components to catch rendering errors.
 * Displays a user-friendly error screen with a reload button on crash.
 *
 * @extends Component
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Updates state when a child component throws during rendering.
   * @param {Error} error - The thrown error
   * @returns {Object} New state with hasError flag
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs error details for debugging.
   * @param {Error} error - The caught error
   * @param {Object} errorInfo - React error info with componentStack
   */
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

ErrorBoundary.propTypes = {
  /** Child components to wrap with error boundary protection */
  children: PropTypes.node.isRequired,
};
