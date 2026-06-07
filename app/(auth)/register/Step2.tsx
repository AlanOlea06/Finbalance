import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Step2({ formData, setFormData, onNext, onBack }: any) {
  const [ciudadError, setCiudadError] = useState<string | null>(null);

  const handleCiudadChange = (text: string) => {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    setFormData({ ...formData, ciudad: text });
    if (text.length > 50)
      setCiudadError("La ciudad no puede exceder los 50 caracteres.");
    else if (text.length > 0 && !nombreRegex.test(text))
      setCiudadError("Nombre inválido.");
    else setCiudadError(null);
  };

  const handleContinuar = () => {
    if (!ciudadError && formData.ciudad && formData.pais && formData.moneda)
      onNext();
    else setCiudadError(!formData.ciudad ? "Requerido" : ciudadError);
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.textSpacing}>
        <Text style={styles.mainTitle}>Configura tu perfil</Text>
        <Text style={styles.mainSubtitle}>Define tu ubicación y moneda</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>País</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          activeOpacity={0.8}
          onPress={() => setFormData({ ...formData, pais: "México" })}
        >
          <Ionicons
            name="map-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <Text style={[styles.inputText, !formData.pais && { color: "#999" }]}>
            {formData.pais || "Selecciona tu país (Ej. Clickeame para México)"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ciudad</Text>
        <View
          style={[styles.inputWrapper, ciudadError ? styles.inputError : null]}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Tu ciudad"
            placeholderTextColor="#999"
            value={formData.ciudad}
            onChangeText={handleCiudadChange}
            maxLength={50}
          />
        </View>
        {ciudadError && <Text style={styles.errorText}>⚠ {ciudadError}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Moneda</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          activeOpacity={0.8}
          onPress={() => setFormData({ ...formData, moneda: "MXN" })}
        >
          <FontAwesome
            name="dollar"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <Text
            style={[styles.inputText, !formData.moneda && { color: "#999" }]}
          >
            {formData.moneda || "Selecciona tu moneda (Ej. Clickeame para MXN)"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

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
          onPress={handleContinuar}
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
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputError: { borderColor: "#ef4444" },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  inputText: { flex: 1, color: "#333", fontSize: 15 },
  errorText: { color: "#fca5a5", fontSize: 12, marginTop: 6 },
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
