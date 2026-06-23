import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';

interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Billy] Render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 32 }}>
            Billy hit an unexpected error. Your data is safe on your device.
          </Text>
          <Pressable
            onPress={() => {
              try {
                const Updates = require('expo-updates');
                if (Updates && Updates.reloadAsync) {
                  Updates.reloadAsync();
                } else {
                  Alert.alert('Notice', 'App restart requires a full app reload.');
                }
              } catch (e) {
                Alert.alert('Notice', 'App restart requires a full app reload.');
              }
            }}
            style={{ backgroundColor: '#1d4ed8', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 24 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Restart App</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
