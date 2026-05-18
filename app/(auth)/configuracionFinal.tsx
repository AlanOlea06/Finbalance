import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PantallaOnboarding() {
  const [salarioFijo, setSalarioFijo] = useState(true);

  return (
    <View style={styles.mainContainer}>
      {/* LADO VERDE*/}
      <View style={styles.leftSide}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* LOGO y PROGRESSBAR */}
          <View style={styles.header}>
            <Text style={styles.logoText}>Finbalance</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>Paso 4 de 4</Text>
              <Text style={styles.progressText}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Títulos y subtitulos */}
          <Text style={styles.mainTitle}>Configuración Final</Text>
          <Text style={styles.mainSubtitle}>
            Define tus ingresos y gastos fijos (opcional).
          </Text>

          {/* Tarjeta 1 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ingreso Fijo</Text>
            <Text style={styles.cardSubtitle}>
              ¿Cuentas con un salario fijo?
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  salarioFijo && styles.toggleBtnActive,
                ]}
                onPress={() => setSalarioFijo(true)}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    salarioFijo && styles.toggleBtnTextActive,
                  ]}
                >
                  Sí
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  !salarioFijo && styles.toggleBtnActive,
                ]}
                onPress={() => setSalarioFijo(false)}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    !salarioFijo && styles.toggleBtnTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tarjeta 2 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gastos Fijos</Text>
            <Text style={styles.cardSubtitle}>
              Ej: Renta, Luz, Internet, Gasolina
            </Text>

            <Text style={styles.emptyText}>
              Aún no has añadido gastos fijos.
            </Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Concepto *"
              placeholderTextColor="#999"
            />

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.inputFull,
                  { flex: 2, marginRight: 10, marginBottom: 0 },
                ]}
                placeholder="Monto *"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {/* Simulando el Dropdown*/}
              <View
                style={[
                  styles.inputFull,
                  {
                    flex: 1,
                    marginBottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={{ color: "#333" }}>Mensual</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>⊕ Añadir Gasto Fijo</Text>
            </TouchableOpacity>
          </View>

          {/* Botones de Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.btnBack}>
              <Text style={styles.btnBackText}>Atrás</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFinish}>
              <Text style={styles.btnFinishText}>Finalizar Creación</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/*LADO DERECHO BLANCO*/}
      <View style={styles.rightSide}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Toma el control de tus finanzas</Text>
          <Text style={styles.infoDescription}>
            Gestiona tus gastos, ahorra de manera inteligente y alcanza tus
            metas financieras con Finbalance.
          </Text>

          {/* mucho texto */}
          <View style={styles.listItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <View>
              <Text style={styles.listTitle}>Seguimiento en tiempo real</Text>
              <Text style={styles.listDesc}>
                Visualiza tus ingresos y gastos al instante
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <View>
              <Text style={styles.listTitle}>Reportes detallados</Text>
              <Text style={styles.listDesc}>
                Obtén de manera gratuita una noción real de tu ganancia neta
              </Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <View>
              <Text style={styles.listTitle}>Seguro y privado</Text>
              <Text style={styles.listDesc}>
                Toda la información que compartas estará protegida
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ESTILOS css
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },

  // CONTENEDORES PRINCIPALES
  leftSide: {
    flex: 1,
    backgroundColor: "#0F8B7B",
  },
  rightSide: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 40,
    flexGrow: 1,
    justifyContent: "center",
  },

  // LADO VERDE
  header: { marginBottom: 30 },
  logoText: {
    fontSize: 40,
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
  progressBarFill: {
    height: "100%",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 3,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  mainSubtitle: { fontSize: 14, color: "#A3D5CE", marginBottom: 30 },

  card: {
    backgroundColor: "#0C7A6A",
    borderColor: "#19A391",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  cardSubtitle: { fontSize: 12, color: "#A3D5CE", marginBottom: 15 },
  emptyText: {
    fontSize: 12,
    color: "#A3D5CE",
    textAlign: "center",
    marginBottom: 15,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#19A391",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "transparent",
  },
  toggleBtnActive: { backgroundColor: "#FFF" },
  toggleBtnText: { color: "#FFF", fontWeight: "bold" },
  toggleBtnTextActive: { color: "#0F8B7B" },

  inputFull: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    color: "#333",
  },
  addBtn: {
    backgroundColor: "#b7fdf4",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  addBtnText: { color: "#0F8B7B", fontWeight: "bold" },

  footerRow: { flexDirection: "row", marginTop: 10 },
  btnBack: {
    flex: 1,
    backgroundColor: "#0B6D60",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  btnBackText: { color: "#FFF", fontWeight: "bold" },
  btnFinish: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnFinishText: { color: "#0F8B7B", fontWeight: "bold" },

  // LADO BLANCO
  infoContainer: {
    maxWidth: 400,
    padding: 20,
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  checkIcon: {
    color: "#0F8B7B",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 15,
    marginTop: -2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  listDesc: {
    fontSize: 13,
    color: "#666",
  },
});
