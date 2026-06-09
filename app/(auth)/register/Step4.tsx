import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ProgressBar from "./../../../components/ProgressBar";

export default function Step4({
  formData,
  setFormData,
  onBack,
  onSubmit,
  isLoading,
}: any) {
  const [newExpense, setNewExpense] = useState({
    concepto: "",
    monto: "",
    frecuencia: "mensual",
  });
  const [montoError, setMontoError] = useState<string | null>(null);

  const handleAddExpense = () => {
    if (!newExpense.concepto || !newExpense.monto) {
      alert("Ingresa concepto y monto");
      return;
    }
    if (isNaN(parseFloat(newExpense.monto))) {
      setMontoError("Ingresa solo números");
      return;
    }
    setFormData({
      ...formData,
      fixedExpenses: [
        ...formData.fixedExpenses,
        { ...newExpense, monto: parseFloat(newExpense.monto).toFixed(2) },
      ],
    });
    setNewExpense({ concepto: "", monto: "", frecuencia: "mensual" });
    setMontoError(null);
  };

  const handleRemoveExpense = (indexToRemove: number) => {
    setFormData({
      ...formData,
      fixedExpenses: formData.fixedExpenses.filter(
        (_: any, index: number) => index !== indexToRemove,
      ),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Finbalance</Text>
        <ProgressBar step={4} percentage="100%" />
      </View>

      <View style={styles.textSpacing}>
        <Text style={styles.mainTitle}>Configuración Final</Text>
        <Text style={styles.mainSubtitle}>
          Define tus ingresos y gastos fijos (opcional).
        </Text>
      </View>

      {formData.useType === "personal" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingreso Fijo</Text>
          <Text style={styles.cardSubtitle}>¿Cuentas con un salario fijo?</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                formData.hasFixedSalary === "yes" && styles.toggleBtnActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, hasFixedSalary: "yes" })
              }
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  formData.hasFixedSalary === "yes" &&
                    styles.toggleBtnTextActive,
                ]}
              >
                Sí
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                formData.hasFixedSalary === "no" && styles.toggleBtnActive,
              ]}
              onPress={() => setFormData({ ...formData, hasFixedSalary: "no" })}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  formData.hasFixedSalary === "no" &&
                    styles.toggleBtnTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {formData.hasFixedSalary === "yes" && (
            <View style={styles.extraSection}>
              <TextInput
                style={[styles.input, { marginBottom: 15 }]}
                placeholder="Monto de salario (neto)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.fixedSalaryAmount}
                onChangeText={(text) =>
                  setFormData({ ...formData, fixedSalaryAmount: text })
                }
              />
              <Text style={styles.miniLabel}>Frecuencia de pago:</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    formData.fixedSalaryFrequency === "semanal" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      fixedSalaryFrequency: "semanal",
                    })
                  }
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      formData.fixedSalaryFrequency === "semanal" &&
                        styles.toggleBtnTextActive,
                    ]}
                  >
                    Semanal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    formData.fixedSalaryFrequency === "quincenal" &&
                      styles.toggleBtnActive,
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      fixedSalaryFrequency: "quincenal",
                    })
                  }
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      formData.fixedSalaryFrequency === "quincenal" &&
                        styles.toggleBtnTextActive,
                    ]}
                  >
                    Quincenal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {formData.useType === "negocio" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Administración de Negocio</Text>
          <Text style={styles.cardSubtitle}>
            Módulo de empleados (próximamente)
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos Fijos</Text>
        <Text style={styles.cardSubtitle}>
          Ej: Renta, Luz, Internet, Gasolina
        </Text>

        {formData.fixedExpenses.length === 0 ? (
          <Text style={styles.emptyText}>Aún no has añadido gastos fijos.</Text>
        ) : (
          <View style={{ marginBottom: 20 }}>
            {formData.fixedExpenses.map((exp: any, index: number) => (
              <View key={index} style={styles.listItemRow}>
                <Text style={styles.listItemText}>
                  {exp.concepto} - ${exp.monto} ({exp.frecuencia})
                </Text>
                <TouchableOpacity onPress={() => handleRemoveExpense(index)}>
                  <Ionicons name="trash-outline" size={20} color="#fca5a5" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TextInput
          style={[styles.input, { marginBottom: 15 }]}
          placeholder="Concepto *"
          placeholderTextColor="#999"
          value={newExpense.concepto}
          onChangeText={(text) =>
            setNewExpense({ ...newExpense, concepto: text })
          }
        />

        <View style={styles.row}>
          <View style={{ flex: 2, marginRight: 15 }}>
            <TextInput
              style={[styles.input, montoError && styles.inputError]}
              placeholder="Monto *"
              keyboardType="numeric"
              placeholderTextColor="#999"
              value={newExpense.monto}
              onChangeText={(text) =>
                setNewExpense({ ...newExpense, monto: text })
              }
            />
          </View>
          <TouchableOpacity
            style={[
              styles.input,
              { flex: 1, justifyContent: "center", alignItems: "center" },
            ]}
            onPress={() =>
              setNewExpense({
                ...newExpense,
                frecuencia:
                  newExpense.frecuencia === "mensual" ? "semanal" : "mensual",
              })
            }
          >
            <Text style={{ color: "#333", fontWeight: "600" }}>
              {newExpense.frecuencia === "mensual" ? "Mensual" : "Semanal"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddExpense}>
          <Text style={styles.addBtnText}>⊕ Añadir Gasto Fijo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={onBack}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.btnBackText}>Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnFinish}
          onPress={onSubmit}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0F8B7B" />
          ) : (
            <Text style={styles.btnFinishText}>Finalizar Creación</Text>
          )}
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
  textSpacing: { marginBottom: 20 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 16, color: "#A3D5CE" },
  card: {
    backgroundColor: "#0C7A6A",
    borderColor: "#19A391",
    borderWidth: 1,
    borderRadius: 12,
    padding: 25,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  cardSubtitle: { fontSize: 13, color: "#A3D5CE", marginBottom: 20 },
  miniLabel: { fontSize: 14, color: "#FFF", marginBottom: 12, marginTop: 20 },
  emptyText: {
    fontSize: 14,
    color: "#A3D5CE",
    textAlign: "center",
    marginBottom: 20,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  toggleBtn: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#19A391",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "transparent",
  },
  toggleBtnActive: { backgroundColor: "#FFF" },
  toggleBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  toggleBtnTextActive: { color: "#0F8B7B" },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: "#333",
    fontSize: 15,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  inputError: { borderWidth: 2, borderColor: "#ef4444" },
  extraSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#19A391",
    paddingTop: 20,
  },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0B6D60",
    padding: 15,
    borderRadius: 6,
    marginBottom: 8,
  },
  listItemText: { color: "#FFF", fontSize: 14, fontWeight: "500" },
  addBtn: {
    backgroundColor: "#b7fdf4",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  addBtnText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 15 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  btnFinish: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  btnFinishText: { color: "#0F8B7B", fontWeight: "bold", fontSize: 16 },
});
