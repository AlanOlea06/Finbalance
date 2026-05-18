import React, { useState } from "react"; // Asegúrate de importar useState
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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

export default function PantallaLogin() {
  const { width } = useWindowDimensions();
  const esMovil = width < 768;

  // NUEVO: Estado para controlar la visibilidad de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftSide}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.logoText}>Finbalance</Text>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Bienvenido de nuevo</Text>
            <Text style={styles.welcomeSubtitle}>
              Ingresa a tu cuenta para continuar
            </Text>

            {/* Input de Correo */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.iconPlaceholder}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input de Contraseña (ACTUALIZADO) */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.iconPlaceholder}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!mostrarPassword} // Depende del estado
              />

              {/* Botón para mostrar/ocultar */}
              <TouchableOpacity
                onPress={() => setMostrarPassword(!mostrarPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.iconPlaceholder}>
                  {mostrarPassword ? "😲" : "🫣"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Opciones y Botón Iniciar Sesión ... (resto del código igual) */}
            <View style={styles.optionsRow}>
              <View style={styles.checkboxGroup}>
                <View style={styles.checkbox} />
                <Text style={styles.optionText}>Recordarme</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.optionText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnLogin} activeOpacity={0.8}>
              <Text style={styles.btnLoginText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.signupFooter}>
              <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

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
  leftSide: { flex: 1, backgroundColor: "#0F8B7B" },
  scrollContent: { padding: 40, flexGrow: 1, justifyContent: "center" },
  logoText: {
    fontSize: 0,
    fontWeight: "bold",
    color: "#FFF",
    position: "absolute",
    top: 40,
    left: 40,
  },
  formContainer: { maxWidth: 450, width: "100%", alignSelf: "center" },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  welcomeSubtitle: { fontSize: 16, color: "#A3D5CE", marginBottom: 30 },
  label: { color: "#FFF", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  iconPlaceholder: { fontSize: 18, color: "#666", marginRight: 10 },

  // Input con la corrección del borde negro para Web
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
    fontSize: 15,
    outlineStyle: "none" as any,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  checkboxGroup: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#A3D5CE",
    borderRadius: 4,
    marginRight: 8,
  },
  optionText: { color: "#FFF", fontSize: 13 },
  btnLogin: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnLoginText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },
  signupFooter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: { color: "#FFF" },
  signupLink: {
    color: "#FFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
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
