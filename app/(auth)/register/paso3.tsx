import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
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

export default function PantallaTipoDeUso() {
  const { width } = useWindowDimensions();
  const esMovil = width < 768;

  // Estado para manejar la selección del tipo de uso
  const [tipoUso, setTipoUso] = useState<"personales" | "negocio">(
    "personales",
  );

  return (
    <View style={styles.mainContainer}>
      {/*LADO IZQUIERDO*/}
      <View style={styles.leftSide}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo y Progreso */}
          <View style={styles.header}>
            <Text style={styles.logoText}>Finbalance</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>Paso 3 de 4</Text>
              <Text style={styles.progressText}>75%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "75%" }]} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>Tipo de Uso</Text>
            <Text style={styles.mainSubtitle}>
              ¿Cómo planeas usar Finbalance?
            </Text>

            {/* Opción 1: Finanzas Personales */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                tipoUso === "personales"
                  ? styles.optionCardActive
                  : styles.optionCardInactive,
              ]}
              onPress={() => setTipoUso("personales")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionIcon,
                  tipoUso === "personales"
                    ? styles.textActive
                    : styles.textInactive,
                ]}
              >
                👤
              </Text>
              <Text
                style={[
                  styles.optionText,
                  tipoUso === "personales"
                    ? styles.textActive
                    : styles.textInactive,
                ]}
              >
                Finanzas Personales
              </Text>
            </TouchableOpacity>

            {/* Opción 2: Administrar un Negocio */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                tipoUso === "negocio"
                  ? styles.optionCardActive
                  : styles.optionCardInactive,
              ]}
              onPress={() => setTipoUso("negocio")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionIcon,
                  tipoUso === "negocio"
                    ? styles.textActive
                    : styles.textInactive,
                ]}
              >
                💼
              </Text>
              <Text
                style={[
                  styles.optionText,
                  tipoUso === "negocio"
                    ? styles.textActive
                    : styles.textInactive,
                ]}
              >
                Administrar un Negocio
              </Text>
            </TouchableOpacity>

            {/* Botones Atrás y Continuar */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => router.push("/register/paso2")}
                style={styles.btnBack}
                activeOpacity={0.8}
              >
                <Text style={styles.btnBackText}>Atrás</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/register/paso4")}
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

      {/*LADO DERECHO*/}
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
  mainSubtitle: { fontSize: 16, color: "#A3D5CE", marginBottom: 35 },

  // Estilos de las tarjetas de selección
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  optionCardActive: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },
  optionCardInactive: {
    backgroundColor: "transparent",
    borderColor: "#19A391", // Verde un poco más claro para el borde
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textActive: {
    color: "#0F8B7B",
  },
  textInactive: {
    color: "#FFF",
  },

  // Botones de acción
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#0B6D60",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  btnBackText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  btnContinue: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  btnContinueText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },

  // Footer
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
