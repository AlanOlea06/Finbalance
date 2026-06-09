import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navbar from '../../components/Navbar';
import { AuthProvider, useAuth } from '../../lib/authContext';

const AuthenticatedApp = ({ children }: { children: React.ReactNode }) => {
  const { loading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.replace('/login');
    }
  }, [loading, profile, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

const UserLoggedLayout = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthenticatedApp>
          <View style={styles.container}>
            <StatusBar style="light" />
            <Navbar />
            <View style={styles.content}>
              <Slot />
            </View>
          </View>
        </AuthenticatedApp>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
});

export default UserLoggedLayout;
