import { MyButton } from "@/components/ui/boton";
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
import { COLORS } from "../../constants/colors";

// ── Breakpoints ────────────────────────────────────────────────────
const CARDS_BREAKPOINT = 580;

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

const GASTOS_INICIALES: Gasto[] = [
  {
    id: 1,
    nombre: "Renta",
    cantidad: 1500,
    tipoRecurrencia: "recurrente",
    periodicidad: "mensual",
    tipoGasto: "normal",
  },
];

// ────────────────────────────────────────────────────────────────────
// Componente: Toggle de opciones reutilizable  (sin cambios)
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
            style={[toggleStyles.btn, isActive && { backgroundColor: activeColor }]}
            activeOpacity={0.8}
          >
            <Text style={[toggleStyles.text, isActive && toggleStyles.textActive]}>
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
  const periodo =
    gasto.periodicidad.charAt(0).toUpperCase() + gasto.periodicidad.slice(1);

  return (
    <View style={cardStyles.container}>
      {/* Fila principal */}
      <View style={cardStyles.row}>
        {/* Icono */}
        <View style={cardStyles.iconCircle}>
          <Text style={cardStyles.iconText}>▤</Text>
        </View>

        {/* Info */}
        <View style={cardStyles.info}>
          <Text style={cardStyles.nombre}>{gasto.nombre}</Text>
          <Text style={cardStyles.cantidad}>${gasto.cantidad.toFixed(2)}</Text>
          {gasto.tipoRecurrencia === "recurrente" && (
            <Text style={cardStyles.periodo}>{periodo}</Text>
          )}
        </View>
      </View>

      {/* Botón registrar */}
      <TouchableOpacity style={cardStyles.registrarBtn} activeOpacity={0.75}>
        <Text style={cardStyles.registrarIcon}>◎</Text>
        <Text style={cardStyles.registrarText}>Registrar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}
const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    width: 200,                // ancho fijo como en la imagen
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    color: COLORS.danger
  },
  info: {
    flex: 1
  },
  nombre: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    marginBottom: 2
  },
  cantidad: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.danger,
    marginBottom: 2
  },
  periodo: {
    fontSize: 12,
    color: COLORS.textMuted
  },
  registrarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 9,
  },
  registrarIcon: {
    fontSize: 14,
    color: COLORS.textMuted
  },
  registrarText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500"
  },
});

// ────────────────────────────────────────────────────────────────────
// Componente: Estado vacío genérico
// ────────────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={emptyStyles.box}>
      <Text style={emptyStyles.icon}>{icon}</Text>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.subtitle}>{subtitle}</Text>
    </View>
  );
}
const emptyStyles = StyleSheet.create({
  box: {
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
  icon: {
    fontSize: 32,
    color: COLORS.textMuted,
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20
  },
});

// ────────────────────────────────────────────────────────────────────
// Componente: Cabecera de sección
// ────────────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={sectionStyles.row}>
      <Text style={sectionStyles.title}>{title}</Text>
      {subtitle && <Text style={sectionStyles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 12
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted
  },
});

// ────────────────────────────────────────────────────────────────────
// Componente: Modal del formulario  (sin cambios respecto a la versión anterior)
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
    if (!form.nombre.trim()) { setError("El nombre del gasto es obligatorio."); return; }
    const n = parseFloat(form.cantidad);
    if (!form.cantidad || isNaN(n) || n <= 0) { setError("Ingresa una cantidad válida mayor a 0."); return; }
    onGuardar(form);
    setForm(FORM_INICIAL);
    setError("");
  }

  function handleClose() { onClose(); setForm(FORM_INICIAL); setError(""); }

  const modalWidth = Math.min(width * 0.92, 500);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleClose} activeOpacity={1} />

        <View style={[modalStyles.card, { width: modalWidth }]}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Nuevo Gasto</Text>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
              <Text style={modalStyles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={modalStyles.label}>Tipo de gasto</Text>
            <OptionToggle
              options={[
                { value: "recurrente", label: "Recurrente" },
                { value: "no-recurrente", label: "No recurrente" },
              ]}
              value={form.tipoRecurrencia}
              onChange={(v) => set("tipoRecurrencia", v)}
            />

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

            <Text style={modalStyles.label}>Nombre del gasto</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Ej. Netflix, Renta, Café..."
              placeholderTextColor={COLORS.textMuted}
              value={form.nombre}
              onChangeText={(v) => set("nombre", v)}
            />

            <Text style={modalStyles.label}>Categoría del gasto</Text>
            <OptionToggle
              options={[
                { value: "normal", label: "Necesario / Normal" },
                { value: "hormiga", label: "🐜 Gasto Hormiga" },
              ]}
              value={form.tipoGasto}
              onChange={(v) => set("tipoGasto", v)}
              activeColor={form.tipoGasto === "hormiga" ? COLORS.orange : COLORS.primary}
            />
            {form.tipoGasto === "hormiga" && (
              <Text style={modalStyles.hint}>
                Los gastos hormiga son pequeños y frecuentes que suman mucho sin que te des cuenta.
              </Text>
            )}

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

            {error !== "" && (
              <View style={modalStyles.errorBox}>
                <Text style={modalStyles.errorText}>{error}</Text>
              </View>
            )}

            <View style={modalStyles.actions}>
              <MyButton
                type="secondary"
                text="Cancelar"
                align="center"
                onPress={() => handleClose()}
              />

              <MyButton
                type="primary"
                text="Guardar gasto"
                align="center"
                onPress={() => handleGuardar()}
              />
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark
  },
  closeBtn: {
    fontSize: 18,
    color: COLORS.textMuted,
    padding: 4
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8
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
    marginRight: 4
  },
  hint: {
    fontSize: 11,
    color: COLORS.orange,
    marginTop: 6,
    lineHeight: 16
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    marginTop: 12
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "500"
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    marginBottom: 4
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  btnCancelarText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted
  },
  btnGuardar: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  btnGuardarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white
  },
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

  // ── Clasificación de gastos por sección ───────────────────────
  const gastosFijos = gastos.filter((g) => g.tipoRecurrencia === "recurrente");
  const gastosHormiga = gastos.filter((g) => g.tipoGasto === "hormiga" && g.tipoRecurrencia === "no-recurrente");

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Encabezado */}
        <View style={[styles.pageHeader, isNarrow && styles.pageHeaderNarrow]}>
          <Text style={styles.pageTitle}>Tus Gastos</Text>
          
          <MyButton
            maxWidth={300}
            type="primary"
            text="+ Agregar Nuevo Gasto"
            align="center"
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* ── Gastos Fijos ── */}
        <SectionHeader title="Gastos Fijos" />
        {gastosFijos.length === 0 ? (
          <EmptyState
            icon="▤"
            title="Sin gastos fijos"
            subtitle="Aún no has registrado gastos recurrentes."
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {gastosFijos.map((g) => <GastoCard key={g.id} gasto={g} />)}
          </ScrollView>
        )}

        {/* ── Gastos Variables (Hormiga) ── */}
        <SectionHeader
          title="Gastos Variables (Hormiga)"
          subtitle="Registros de este mes (excluye abonos)."
        />
        {gastosHormiga.length === 0 ? (
          <EmptyState
            icon="!"
            title="Sin gastos hormiga"
            subtitle="Aún no has registrado gastos variables este mes."
          />
        ) : (
          gastosHormiga.map((g) => <GastoCard key={g.id} gasto={g} />)
        )}

        {/* ── Historial de Abonos ── */}
        <SectionHeader
          title="Historial de Abonos"
          subtitle="Tus abonos a ahorros y deudas."
        />
        <EmptyState
          icon="✓"
          title="Sin abonos registrados"
          subtitle={"Cuando abones a tus metas de ahorro o deuda, aparecerán aquí."}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

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
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 12,
  },
});