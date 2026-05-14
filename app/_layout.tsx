import { Ionicons } from '@expo/vector-icons'; // Iconos de Expo
import { Stack } from "expo-router";
import { Alert, Image, TouchableOpacity } from 'react-native';

export default function RootLayout() {
  return (
  <Stack
      screenOptions={{
        headerStyle: { 
          backgroundColor: '#0C9488', // El color de fondo del header para toda la app
        },
        headerTintColor: '#ffffff',   // El color de la flecha de atrás y el texto
        headerTitleStyle: { 
          fontWeight: 'bold',         // Estilo del título
        },
        headerTitleAlign: 'left',   // Centrar el título en Android y iOS
      }}
  >
    <Stack.Screen 
        name="perfil2" 
        options={{
          // 1. MODIFICAR EL CENTRO (Ej. Poner un Logo)
          headerTitle: () => (
            <Image 
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
              style={{ width: 30, height: 30 }} 
            />
          ),
          headerTitleAlign: 'center', // Asegura que se centre en Android y iOS

          // 2. MODIFICAR LA DERECHA (Ej. Un botón de configuración)
          headerRight: () => (
            
            <TouchableOpacity onPress={() => Alert.alert('Ajustes', 'Abriendo ajustes...')}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }} 
      />
      {/* Excepciones a la regla (Configuración individual) */}
      {/* Esta pantalla en específico NO tendrá header, ignorando lo de arriba */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
    {/* Otras pantallas usarán el header azul global automáticamente */}
    <Stack.Screen name="perfil" options={{ title: 'Mi Perfil' }} />
  </Stack>
  );
}
