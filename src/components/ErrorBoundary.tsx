import { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>Oops, something went wrong.</Text>
            <Text style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </Text>
            <Pressable
              onPress={() => this.setState({ hasError: false })}
              style={{ backgroundColor: '#208AEF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Try Again</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
