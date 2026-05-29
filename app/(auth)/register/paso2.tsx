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

// Interfaz y Componente para el lado derecho
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

export default function PantallaConfiguracionPerfil() {
  const { width } = useWindowDimensions();
  const esMovil = width < 768;

  // Estados básicos para los campos
  const [ciudad, setCiudad] = useState("");

  return (
    <View style={styles.mainContainer}>
      {/* LADO IZQUIERDO VERDE */}
      <View style={styles.leftSide}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo y Progreso */}
          <View style={styles.header}>
            <Text style={styles.logoText}>Finbalance</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>Paso 2 de 4</Text>
              <Text style={styles.progressText}>50%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "50%" }]} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>Configura tu perfil</Text>
            <Text style={styles.mainSubtitle}>
              Define tu ubicación y moneda
            </Text>

            {/* Input Simulado*/}
            <Text style={styles.label}>País</Text>
            <TouchableOpacity style={styles.inputWrapper} activeOpacity={0.8}>
              <Text style={styles.icon}>🗺</Text>
              <TextInput
                style={[styles.input, { pointerEvents: "none" } as any]} // Evita que se escriba, simula un select
                placeholder="Selecciona tu país"
                placeholderTextColor="#999"
                editable={false}
              />
              <Text style={styles.iconRight}></Text>
            </TouchableOpacity>

            {/* Input Normal: Ciudad */}
            <Text style={styles.label}>Ciudad</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu ciudad"
                placeholderTextColor="#999"
                value={ciudad}
                onChangeText={setCiudad}
              />
            </View>

            {/* Input Simulado: Moneda */}
            <Text style={styles.label}>Moneda</Text>
            <TouchableOpacity style={styles.inputWrapper} activeOpacity={0.8}>
              <Text style={styles.icon}>$</Text>
              <TextInput
                style={[styles.input, { pointerEvents: "none" } as any]}
                placeholder="Selecciona tu moneda"
                placeholderTextColor="#999"
                editable={false}
              />
              <Text style={styles.iconRight}></Text>
            </TouchableOpacity>

            {/* Botones Atrás y Continuar */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/register/signIn")}
                style={styles.btnBack}
                activeOpacity={0.8}
              >
                <Text style={styles.btnBackText}>Atrás</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/register/paso3")}
                style={styles.btnContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.btnContinueText}>Continuar</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* LADO DERECHO BLANCO*/}
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

// ESTILOS
const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: "row" },

  // LADO IZQUIERDO
  leftSide: { flex: 1, backgroundColor: "#0F8B7B" },
  scrollContent: { padding: 40, flexGrow: 1, justifyContent: "center" },

  header: { marginBottom: 30 },
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
  iconRight: { fontSize: 18, color: "#666", marginLeft: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
    fontSize: 15,
    outlineStyle: "none" as any, // Quita el borde negro en web
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#0B6D60", // Verde oscuro para el botón secundario
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  btnBackText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  btnContinue: {
    flex: 1,
    backgroundColor: "#FFF", // Blanco para el botón principal
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  btnContinueText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
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
