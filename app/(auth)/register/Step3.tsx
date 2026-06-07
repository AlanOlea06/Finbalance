import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "../../../components/ProgressBar";

export default function Step3({ formData, setFormData, onNext, onBack }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Finbalance</Text>
        <ProgressBar step={3} percentage="75%" />
      </View>

      <View style={styles.textSpacing}>
        <Text style={styles.mainTitle}>Tipo de Uso</Text>
        <Text style={styles.mainSubtitle}>¿Cómo planeas usar Finbalance?</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.useType === "personal"
            ? styles.optionCardActive
            : styles.optionCardInactive,
        ]}
        onPress={() => setFormData({ ...formData, useType: "personal" })}
        activeOpacity={0.8}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={formData.useType === "personal" ? "#0F8B7B" : "#FFF"}
          style={styles.optionIcon}
        />
        <Text
          style={[
            styles.optionText,
            formData.useType === "personal"
              ? styles.textActive
              : styles.textInactive,
          ]}
        >
          Finanzas Personales
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          formData.useType === "negocio"
            ? styles.optionCardActive
            : styles.optionCardInactive,
        ]}
        onPress={() => setFormData({ ...formData, useType: "negocio" })}
        activeOpacity={0.8}
      >
        <Ionicons
          name="briefcase-outline"
          size={24}
          color={formData.useType === "negocio" ? "#0F8B7B" : "#FFF"}
          style={styles.optionIcon}
        />
        <Text
          style={[
            styles.optionText,
            formData.useType === "negocio"
              ? styles.textActive
              : styles.textInactive,
          ]}
        >
          Administrar un Negocio
        </Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={styles.btnBackText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnContinue}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.btnContinueText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 15 },
  header: { marginBottom: 15 },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  textSpacing: { marginBottom: 25 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 16, color: "#A3D5CE" },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
  },
  optionCardActive: { backgroundColor: "#FFF", borderColor: "#FFF" },
  optionCardInactive: {
    backgroundColor: "transparent",
    borderColor: "#19A391",
  },
  optionIcon: { marginRight: 15 },
  optionText: { fontSize: 18, fontWeight: "bold" },
  textActive: { color: "#0F8B7B" },
  textInactive: { color: "#FFF" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 20,
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#0B6D60",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  btnBackText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  btnContinue: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  btnContinueText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },
});
