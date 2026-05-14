import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}> 
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.title}>Finbalance</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('./(app)/dashboard') }
          >
            <Text style={styles.primaryButtonText}>Ir al Dashboard</Text>
          </TouchableOpacity>
					<TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login') }
          >
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5E8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
		width: '50%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  // Text styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0C9488',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C9488',
    letterSpacing: 6,
    marginTop: 4,
    textAlign: 'center',
  },
  // Button styles
  buttonSection: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#0C9488',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Welcome;
