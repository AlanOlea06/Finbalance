import { Stack } from 'expo-router';
import { LogBox } from 'react-native';



export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
