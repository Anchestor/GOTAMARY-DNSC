import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '12px',
          color: '#555',
          background: '#0a0a0f',
        }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>
            {this.props.name ?? 'Component'} failed to render
          </div>
          <div style={{ fontSize: 11, color: '#444', maxWidth: 300, textAlign: 'center', lineHeight: 1.5 }}>
            {this.state.error?.includes('webgl') || this.state.error?.includes('WebGL')
              ? 'WebGL is not available in this environment.'
              : this.state.error}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
