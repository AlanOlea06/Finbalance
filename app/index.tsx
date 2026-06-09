import { MyButton } from "@/components/ui/boton";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          {/* Logo Section */}
          <Text style={styles.title}>Finbalance</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo</Text>

          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <MyButton
              size={500}
              type="primary"
              text="Iniciar sesión"
              align="center"
              onPress={() => router.push("/(auth)/login")}
            />
            <MyButton
              size={500}
              type="secondary"
              text="Registrarse"
              align="center"
              onPress={() => router.push("/login")}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5E8",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0C9488",
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C9488",
    letterSpacing: 6,
    marginTop: 4,
    textAlign: "center",
  },
  buttonSection: {
    marginTop: 80,
    width: "100%",
    gap: 12,
  },
});

export default Index;
