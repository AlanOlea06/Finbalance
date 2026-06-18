import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";

// ── Breakpoints ────────────────────────────────────────────────────
const CARDS_BREAKPOINT = 580;

// ── Colores (mismos que el resto de la app) ────────────────────────
const COLORS = {
  primary: "#0C9488",
  primaryLight: "#E6F7F1",
  orange: "#E07B3A",
  orangeLight: "#FDF0E8",
  background: "#F2F4F7",
  white: "#FFFFFF",
  textDark: "#1A2332",
  textMuted: "#8A97A8",
  border: "#E8ECF0",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  success: "#16A34A",
};

// ── Tipos ──────────────────────────────────────────────────────────
type TipoRecurrencia = "recurrente" | "no-recurrente";
type Periodicidad = "mensual" | "semanal";
type TipoGasto = "hormiga" | "normal";

type Gasto = {
  id: number;
  nombre: string;
  cantidad: number;
  tipoRecurrencia: TipoRecurrencia;
  periodicidad: Periodicidad;
  tipoGasto: TipoGasto;
};

type FormData = {
  nombre: string;
  cantidad: string;
  tipoRecurrencia: TipoRecurrencia;
  periodicidad: Periodicidad;
  tipoGasto: TipoGasto;
};

const FORM_INICIAL: FormData = {
  nombre: "",
  cantidad: "",
  tipoRecurrencia: "recurrente",
  periodicidad: "mensual",
  tipoGasto: "normal",
};

// ── Datos de ejemplo ───────────────────────────────────────────────
const GASTOS_INICIALES: Gasto[] = [
  {
    id: 1,
    nombre: "Renta",
    cantidad: 3500,
    tipoRecurrencia: "recurrente",
    periodicidad: "mensual",
    tipoGasto: "normal",
  },
];

// ────────────────────────────────────────────────────────────────────
// Componente: Toggle de opciones reutilizable
// ────────────────────────────────────────────────────────────────────
function OptionToggle<T extends string>({
  options,
  value,
  onChange,
  activeColor = COLORS.primary,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  activeColor?: string;
}) {
  return (
    <View style={toggleStyles.container}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              toggleStyles.btn,
              isActive && { backgroundColor: activeColor },
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                toggleStyles.text,
                isActive && toggleStyles.textActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.border,
    borderRadius: 10,
    padding: 3,
    alignSelf: "stretch",
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  text: { fontSize: 13, fontWeight: "600", color: COLORS.textMuted },
  textActive: { color: COLORS.white },
});

// ────────────────────────────────────────────────────────────────────
// Componente: Tarjeta de gasto
// ────────────────────────────────────────────────────────────────────
function GastoCard({ gasto }: { gasto: Gasto }) {
  const isHormiga = gasto.tipoGasto === "hormiga";
  const iconBg = isHormiga ? COLORS.orangeLight : COLORS.primaryLight;
  const iconColor = isHormiga ? COLORS.orange : COLORS.primary;
  const labelRecurrencia =
    gasto.tipoRecurrencia === "recurrente"
      ? "Gasto Recurrente"
      : "Gasto Único";
  const labelPeriodo =
    gasto.tipoRecurrencia === "recurrente"
      ? gasto.periodicidad.charAt(0).toUpperCase() + gasto.periodicidad.slice(1)
      : null;
  const labelTipo = isHormiga ? "Gasto Hormiga" : "Necesario/Normal";

  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.row}>
        {/* Icono */}
        <View style={[cardStyles.iconCircle, { backgroundColor: iconBg }]}>
          <Text style={[cardStyles.iconText, { color: iconColor }]}>$</Text>
        </View>

        {/* Contenido */}
        <View style={cardStyles.content}>
          <Text style={cardStyles.nombre}>{gasto.nombre}</Text>
          <View style={cardStyles.amountRow}>
            <Text style={[cardStyles.cantidad, { color: iconColor }]}>
              ${gasto.cantidad.toFixed(2)}
            </Text>
            {labelPeriodo && (
              <Text style={cardStyles.periodo}>/{gasto.periodicidad}</Text>
            )}
          </View>
          <Text style={cardStyles.tags}>
            {[labelPeriodo, labelRecurrencia].filter(Boolean).join(" • ")}
          </Text>
        </View>

        {/* Badge tipo */}
        <View
          style={[
            cardStyles.badge,
            { backgroundColor: isHormiga ? COLORS.orangeLight : COLORS.primaryLight },
          ]}
        >
          <Text
            style={[cardStyles.badgeText, { color: iconColor }]}
          >
            {isHormiga ? "🐜 Hormiga" : "✓ Normal"}
          </Text>
        </View>
      </View>

      {/* Pie */}
      <View style={cardStyles.footer}>
        <Text style={[cardStyles.footerText, { color: iconColor }]}>
          Activo •{" "}
          {gasto.tipoRecurrencia === "recurrente"
            ? "Se descuenta automáticamente"
            : "Gasto registrado"}
        </Text>
      </View>
    </View>
  );
}
const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20, fontWeight: "700" },
  content: { flex: 1 },
  nombre: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  amountRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  cantidad: { fontSize: 18, fontWeight: "700" },
  periodo: { fontSize: 12, color: COLORS.textMuted },
  tags: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  badge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: { fontSize: 12, fontWeight: "500" },
});

// ────────────────────────────────────────────────────────────────────
// Componente: Modal del formulario
// ────────────────────────────────────────────────────────────────────
function FormModal({
  visible,
  onClose,
  onGuardar,
}: {
  visible: boolean;
  onClose: () => void;
  onGuardar: (data: FormData) => void;
}) {
  const { width } = useWindowDimensions();
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setError("");
  }

  function handleGuardar() {
    if (!form.nombre.trim()) {
      setError("El nombre del gasto es obligatorio.");
      return;
    }
    const cantidadNum = parseFloat(form.cantidad);
    if (!form.cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      setError("Ingresa una cantidad válida mayor a 0.");
      return;
    }
    onGuardar(form);
    setForm(FORM_INICIAL);
    setError("");
  }

  function handleClose() {
    onClose();
    setForm(FORM_INICIAL);
    setError("");
  }

  const modalWidth = Math.min(width * 0.92, 500);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
          activeOpacity={1}
        />

        <View style={[modalStyles.card, { width: modalWidth }]}>
          {/* Encabezado */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Nuevo Gasto</Text>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
              <Text style={modalStyles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Tipo de recurrencia */}
            <Text style={modalStyles.label}>Tipo de gasto</Text>
            <OptionToggle
              options={[
                { value: "recurrente", label: "Recurrente" },
                { value: "no-recurrente", label: "No recurrente" },
              ]}
              value={form.tipoRecurrencia}
              onChange={(v) => set("tipoRecurrencia", v)}
            />

            {/* Periodicidad (solo si es recurrente) */}
            {form.tipoRecurrencia === "recurrente" && (
              <>
                <Text style={modalStyles.label}>Periodicidad</Text>
                <OptionToggle
                  options={[
                    { value: "mensual", label: "Mensual" },
                    { value: "semanal", label: "Semanal" },
                  ]}
                  value={form.periodicidad}
                  onChange={(v) => set("periodicidad", v)}
                />
              </>
            )}

            {/* Nombre */}
            <Text style={modalStyles.label}>Nombre del gasto</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Ej. Netflix, Renta, Café..."
              placeholderTextColor={COLORS.textMuted}
              value={form.nombre}
              onChangeText={(v) => set("nombre", v)}
            />

            {/* Tipo de gasto */}
            <Text style={modalStyles.label}>Categoría del gasto</Text>
            <OptionToggle
              options={[
                { value: "normal", label: "Necesario / Normal" },
                { value: "hormiga", label: "🐜 Gasto Hormiga" },
              ]}
              value={form.tipoGasto}
              onChange={(v) => set("tipoGasto", v)}
              activeColor={
                form.tipoGasto === "hormiga" ? COLORS.orange : COLORS.primary
              }
            />
            {form.tipoGasto === "hormiga" && (
              <Text style={modalStyles.hint}>
                Los gastos hormiga son pequeños y frecuentes que suman mucho sin que te des cuenta.
              </Text>
            )}

            {/* Cantidad */}
            <Text style={modalStyles.label}>Cantidad</Text>
            <View style={modalStyles.inputRow}>
              <Text style={modalStyles.currencySymbol}>$</Text>
              <TextInput
                style={[modalStyles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="decimal-pad"
                value={form.cantidad}
                onChangeText={(v) => set("cantidad", v)}
              />
            </View>

            {/* Error de validación */}
            {error !== "" && (
              <View style={modalStyles.errorBox}>
                <Text style={modalStyles.errorText}>{error}</Text>
              </View>
            )}

            {/* Botones */}
            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={modalStyles.btnCancelar}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={modalStyles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.btnGuardar}
                onPress={handleGuardar}
                activeOpacity={0.8}
              >
                <Text style={modalStyles.btnGuardarText}>Guardar gasto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700", color: COLORS.textDark },
  closeBtn: { fontSize: 18, color: COLORS.textMuted, padding: 4 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
    backgroundColor: COLORS.background,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingLeft: 12,
    overflow: "hidden",
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginRight: 4,
  },
  hint: {
    fontSize: 11,
    color: COLORS.orange,
    marginTop: 6,
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    marginBottom: 4,
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  btnCancelarText: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  btnGuardar: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  btnGuardarText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
});

// ────────────────────────────────────────────────────────────────────
// Pantalla principal: Tus Gastos
// ────────────────────────────────────────────────────────────────────
export default function TusGastos() {
  const { width } = useWindowDimensions();
  const isNarrow = width < CARDS_BREAKPOINT;

  const [gastos, setGastos] = useState<Gasto[]>(GASTOS_INICIALES);
  const [modalVisible, setModalVisible] = useState(false);

  function handleGuardar(form: FormData) {
    const nuevo: Gasto = {
      id: Date.now(),
      nombre: form.nombre.trim(),
      cantidad: parseFloat(form.cantidad),
      tipoRecurrencia: form.tipoRecurrencia,
      periodicidad: form.periodicidad,
      tipoGasto: form.tipoGasto,
    };
    setGastos((prev) => [...prev, nuevo]);
    setModalVisible(false);
  }

  const gastosFijos = gastos.filter((g) => g.tipoRecurrencia === "recurrente");
  const otrosGastos = gastos.filter((g) => g.tipoRecurrencia === "no-recurrente");

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Encabezado */}
        <View style={[styles.pageHeader, isNarrow && styles.pageHeaderNarrow]}>
          <Text style={styles.pageTitle}>Tus Gastos</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>+ Agregar Nuevo Gasto</Text>
          </TouchableOpacity>
        </View>

        {/* ── Gastos Fijos (recurrentes) ── */}
        <Text style={styles.sectionTitle}>Gastos Fijos</Text>
        {gastosFijos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>$</Text>
            <Text style={styles.emptyTitle}>Sin gastos fijos</Text>
            <Text style={styles.emptySubtitle}>
              Aún no has registrado gastos recurrentes.
            </Text>
          </View>
        ) : (
          gastosFijos.map((g) => <GastoCard key={g.id} gasto={g} />)
        )}

        {/* ── Otros Gastos (no recurrentes) ── */}
        <View style={styles.otrosSectionHeader}>
          <Text style={styles.sectionTitle}>Otros Gastos</Text>
          <Text style={styles.sectionSubtitle}>Registros de este mes.</Text>
        </View>
        {otrosGastos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>$</Text>
            <Text style={styles.emptyTitle}>Sin gastos variables</Text>
            <Text style={styles.emptySubtitle}>
              Aún no has registrado otros gastos este mes.
            </Text>
          </View>
        ) : (
          otrosGastos.map((g) => <GastoCard key={g.id} gasto={g} />)
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal */}
      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleGuardar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
    gap: 12,
  },
  pageHeaderNarrow: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  otrosSectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emptyBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 36,
    color: COLORS.border,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});