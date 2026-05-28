import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Navbar from '../../components/Navbar';

const UserLoggedLayout = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Navbar />
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
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
