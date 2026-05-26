import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route as Href);
  };

  return (
    <>
      <SafeAreaView edges={['top']}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.7} style={styles.logoContainer}>
            {/*<LogoGreen width={60} height={35} color="#FFFFFF" stroke="#FFFFFF" />*/}
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: "#FFFFFF" }}>Finbalance</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconsContainer}>
            <Ionicons name="notifications-outline" size={28} color="#FFFFFF" onPress={() => handleNavigation('/(app)/dashboard')} />
            <Ionicons name="settings-outline" size={28} color="#FFFFFF" onPress={() => handleNavigation('/(app)/dashboard')} />
            <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" onPress={() => handleNavigation('/(app)/profile')} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#0C9488',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  
});

export default Navbar;
