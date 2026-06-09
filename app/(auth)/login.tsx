import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BenefitSide from "./../../components/BenefitSide";
import PasswordInput from "./../../components/PasswordInput";
import { authService } from "../../lib/authService";

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const esMovil = width < 768; // Lógica para ocultar el lado blanco en celulares

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Por favor, llena todos los campos.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      await authService.signIn(email, password);
      router.replace("/(app)/dashboard");
    } catch (error: any) {
      setLoginError(error?.message ?? "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* LADO IZQUIERDO (VERDE) - Formulario con Scroll */}
      <ScrollView
        style={styles.leftSide}
        contentContainerStyle={styles.leftScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.logoText}>Finbalance</Text>
            </View>

            <View style={styles.textSpacing}>
              <Text style={styles.mainTitle}>Bienvenido de vuelta</Text>
              <Text style={styles.mainSubtitle}>
                Inicia sesión para continuar
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <PasswordInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              showStrength={false}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnLogin}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0F8B7B" />
              ) : (
                <Text style={styles.btnLoginText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}

            <View style={styles.registerPrompt}>
              <Text style={styles.registerPromptText}>
                ¿No tienes una cuenta?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* LADO DERECHO (BLANCO) - Visible solo en pantallas grandes */}
      {!esMovil && (
        <View style={styles.rightSide}>
          <BenefitSide />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: "row" },
  leftSide: { flex: 1, backgroundColor: "#0F8B7B" },
  leftScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  rightSide: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 40,
    justifyContent: "center",
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  backBtn: { marginRight: 15 },
  logoText: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  textSpacing: { marginBottom: 30 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 16, color: "#A3D5CE" },
  inputGroup: { marginBottom: 20 },
  label: { color: "#FFF", fontSize: 14, marginBottom: 12, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: "#333",
    fontSize: 15,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 30 },
  forgotPasswordText: { color: "#A3D5CE", fontSize: 14, fontWeight: "600" },
  btnLogin: {
    backgroundColor: "#FFF",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  btnLoginText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerPromptText: { color: "#A3D5CE", fontSize: 15 },
  registerLink: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  errorText: {
    color: "#FDCACA",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
});
