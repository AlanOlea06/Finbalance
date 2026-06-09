import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import PasswordInput from "./../../../components/PasswordInput";

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

export default function Step1({ formData, setFormData, onNext }: Step1Props) {
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNombreChange = (text: string) => {
    setFormData({ ...formData, nombre: text });
    if (text.startsWith(" "))
      setNombreError("El nombre no puede comenzar con espacios.");
    else if (text.length > 75)
      setNombreError("El nombre no puede exceder los 75 caracteres.");
    else if (text.length > 0 && !nombreRegex.test(text))
      setNombreError("Nombre inválido. Evita usar números o símbolos.");
    else setNombreError(null);
  };

  const handleEmailChange = (text: string) => {
    const cleanEmail = text.toLowerCase().trim();
    setFormData({ ...formData, email: cleanEmail });
    if (cleanEmail.length > 0 && !emailRegex.test(cleanEmail))
      setEmailError("Correo electrónico no válido");
    else setEmailError(null);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setFormData({ ...formData, confirmPassword: text });
    if (text.length > 0 && formData.password !== text)
      setPasswordError("Las contraseñas no coinciden.");
    else setPasswordError(null);
  };

  const handleContinuar = () => {
    if (
      !formData.nombre ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setNombreError(!formData.nombre ? "Requerido" : nombreError);
      setEmailError(!formData.email ? "Requerido" : emailError);
      setPasswordError(!formData.confirmPassword ? "Requerido" : passwordError);
      return;
    }
    if (!nombreError && !emailError && !passwordError) onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Finbalance</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Paso 1 de 4</Text>
          <Text style={styles.progressText}>25%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "25%" }]} />
        </View>
      </View>

      <View style={styles.textSpacing}>
        <Text style={styles.mainTitle}>Crea tu cuenta</Text>
        <Text style={styles.mainSubtitle}>
          Completa tus datos para comenzar
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre completo</Text>
        <View
          style={[styles.inputWrapper, nombreError ? styles.inputError : null]}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#999"
            value={formData.nombre}
            onChangeText={handleNombreChange}
            maxLength={75}
          />
        </View>
        {nombreError && <Text style={styles.errorText}>⚠ {nombreError}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <View
          style={[styles.inputWrapper, emailError ? styles.inputError : null]}
        >
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
            value={formData.email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError && <Text style={styles.errorText}>⚠ {emailError}</Text>}
      </View>

      <PasswordInput
        label="Contraseña"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        showStrength={true}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <PasswordInput
          label=""
          value={formData.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          showStrength={false}
          placeholder="Confirma tu contraseña"
          hasError={passwordError !== null}
        />
        {passwordError && (
          <Text style={styles.errorText}>⚠ {passwordError}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.btnContinue}
        onPress={handleContinuar}
        activeOpacity={0.8}
      >
        <Text style={styles.btnContinueText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 15 },
  header: { marginBottom: 25 },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  progressBarBg: { height: 6, backgroundColor: "#0B6D60", borderRadius: 3 },
  progressBarFill: { height: "100%", backgroundColor: "#FFF", borderRadius: 3 },
  textSpacing: { marginBottom: 15 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 16, color: "#A3D5CE" },
  inputGroup: { marginBottom: 10 },
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
  inputError: { borderColor: "#ef4444" },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: "#333",
    fontSize: 15,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  errorText: { color: "#fca5a5", fontSize: 12, marginTop: 6 },
  btnContinue: {
    backgroundColor: "#FFF",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },
  btnContinueText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },
});
