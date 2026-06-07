import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BeneficioProps {
  titulo: string;
  desc: string;
}

const BeneficioItem = ({ titulo, desc }: BeneficioProps) => (
  <View style={styles.benefitItem}>
    <View style={styles.checkCircle}>
      <Ionicons name="checkmark" size={16} color="#0F8B7B" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.benefitTitle}>{titulo}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
    </View>
  </View>
);

export default function BenefitSide() {
  return (
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>Toma el control de tus finanzas</Text>
      <Text style={styles.infoDesc}>
        Gestiona tus gastos, ahorra de manera inteligente y alcanza tus metas
        financieras con Finbalance.
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
  );
}

const styles = StyleSheet.create({
  infoContent: { maxWidth: 450, padding: 20, width: "100%" },
  infoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoDesc: { fontSize: 16, color: "#666", marginBottom: 40, lineHeight: 24 },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 25,
    alignItems: "flex-start",
  },
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
  textContainer: { flex: 1 },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  benefitDesc: { fontSize: 14, color: "#777", lineHeight: 20 },
});
