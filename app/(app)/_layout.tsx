import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navbar from '../../components/TopBar';

const UserLoggedLayout = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="#0C9488" style="light" />
        <Navbar />
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
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
