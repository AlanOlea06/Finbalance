import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Interfaz para los beneficios del lado derecho
interface BeneficioProps {
  titulo: string;
  desc: string;
}

const BeneficioItem = ({ titulo, desc }: BeneficioProps) => (
  <View style={styles.benefitItem}>
    <View style={styles.checkCircle}>
      <Text style={styles.checkText}>✓</Text>
    </View>
    <View>
      <Text style={styles.benefitTitle}>{titulo}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
    </View>
  </View>
);

export default function PantallaRegistro() {
  const { width } = useWindowDimensions();
  const esMovil = width < 768;

  // Estados para mostrar/ocultar las dos contraseñas
  const [verPass, setVerPass] = useState(false);
  const [verConfirmPass, setVerConfirmPass] = useState(false);

  return (
    <View style={styles.mainContainer}>
      {/* LADO IZQUIERDO (VERDE) - REGISTRO*/}
      <View style={styles.leftSide}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo y Progreso */}
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

          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>Crea tu cuenta</Text>
            <Text style={styles.mainSubtitle}>
              Completa tus datos para comenzar
            </Text>

            {/* Input: Nombre Completo */}
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
              />
            </View>

            {/* Input: Correo */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input: Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!verPass}
              />
              <TouchableOpacity onPress={() => setVerPass(!verPass)}>
                <Text style={styles.icon}>{verPass ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>

            {/* Input: Confirmar Contraseña */}
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!verConfirmPass}
              />
              <TouchableOpacity
                onPress={() => setVerConfirmPass(!verConfirmPass)}
              >
                <Text style={styles.icon}>{verConfirmPass ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>

            {/* Botón Continuar */}
            <TouchableOpacity
              onPress={() => router.push("/register/paso2")}
              style={styles.btnContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.btnContinueText}>Continuar</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* LADO DERECHO*/}
      {!esMovil && (
        <View style={styles.rightSide}>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Toma el control de tus finanzas
            </Text>
            <Text style={styles.infoDesc}>
              Gestiona tus gastos, ahorra de manera inteligente y alcanza tus
              metas financieras con Finbalance.
            </Text>

            <BeneficioItem
              titulo="Seguimiento en tiempo real"
              desc="Visualiza tus ingresos y gastos al instante"
            />
            <BeneficioItem
              titulo="Reportes detallados"
              desc="Obtén de manera gratuita una noción real de tu ganancia neta"
            />
            <BeneficioItem
              titulo="Seguro y privado"
              desc="Toda la información que compartas estará protegida"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: "row" },

  // LADO IZQUIERDO
  leftSide: { flex: 1, backgroundColor: "#0F8B7B" },
  scrollContent: { padding: 40, flexGrow: 1, justifyContent: "center" },

  header: { marginBottom: 30 },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  progressBarBg: { height: 6, backgroundColor: "#0B6D60", borderRadius: 3 },
  progressBarFill: { height: "100%", backgroundColor: "#FFF", borderRadius: 3 },

  formContainer: { maxWidth: 450, width: "100%", alignSelf: "center" },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 16, color: "#A3D5CE", marginBottom: 25 },

  label: { color: "#FFF", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 18,
  },
  icon: { fontSize: 18, color: "#666", marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
    fontSize: 15,
    outlineStyle: "none" as any, // Quita el borde negro en web
  },

  btnContinue: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnContinueText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  footerText: { color: "#FFF" },
  footerLink: {
    color: "#FFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  // LADO DERECHO
  rightSide: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: { maxWidth: 450, padding: 20 },
  infoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoDesc: { fontSize: 16, color: "#666", marginBottom: 40, lineHeight: 24 },

  benefitItem: { flexDirection: "row", marginBottom: 25 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8F5F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 2,
  },
  checkText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 14 },
  benefitTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  benefitDesc: { fontSize: 14, color: "#777" },
});
