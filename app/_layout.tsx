import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack
      screenOptions={{ headerShown: false }}
  >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
    {/* Otras pantallas usarán el header azul global automáticamente */}
    <Stack.Screen name="perfil" options={{ title: 'Mi Perfil' }} />
  </Stack>
  );
}
