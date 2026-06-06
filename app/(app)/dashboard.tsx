import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { MyButton } from "../../components/ui/boton";

// ── Breakpoint: por debajo de esto las cards se apilan en columna ──
const CARDS_BREAKPOINT = 580;

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
  danger: "#E07B3A",
  dangerBg: "#FDF0E8",
};

// ── Barra de progreso ──────────────────────────────────────────────
function ProgressBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={progressStyles.track}>
      <View
        style={[
          progressStyles.fill,
          { width: `${pct}%` as any, backgroundColor: color },
        ]}
      />
    </View>
  );
}
const progressStyles = StyleSheet.create({
  track: {
    height: 7,
    backgroundColor: "#E8ECF0",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 8,
  },
  fill: { height: "100%", borderRadius: 4 },
});

// ── Alerta de advertencia ──────────────────────────────────────────
function WarningAlert({ text }: { text: string }) {
  return (
    <View style={alertStyles.container}>
      <Text style={alertStyles.icon}>⚠️</Text>
      <Text style={alertStyles.text}>{text}</Text>
    </View>
  );
}
const alertStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  icon: { fontSize: 14 },
  text: { color: COLORS.danger, fontSize: 13, fontWeight: "500", flex: 1 },
});

// ── Toggle Semana / Mes ────────────────────────────────────────────
function PeriodToggle({
  active,
  onChange,
}: {
  active: "semana" | "mes";
  onChange: (v: "semana" | "mes") => void;
}) {
  return (
    <View style={toggleStyles.container}>
      {(["semana", "mes"] as const).map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => onChange(period)}
          style={[
            toggleStyles.btn,
            active === period && toggleStyles.btnActive,
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              toggleStyles.text,
              active === period && toggleStyles.textActive,
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: COLORS.border,
    borderRadius: 10,
    padding: 3,
    alignSelf: "flex-start",
  },
  btn: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnActive: { backgroundColor: COLORS.primary },
  text: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  textActive: { color: COLORS.white },
});

// ── Pantalla principal ─────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState<"semana" | "mes">("semana");

  // Detecta el ancho en tiempo real (funciona en web y móvil)
  const { width } = useWindowDimensions();
  const isNarrow = width < CARDS_BREAKPOINT;

  const income = 400;
  const gastosFijos = 375;
  const ahorros = 0;
  const disponible = income - gastosFijos;
  const pctGastos = Math.round((gastosFijos / income) * 100);
  const pctDisponible = Math.round((disponible / income) * 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título */}
      <Text style={styles.title}>Bienvenido de nuevo, di</Text>

      {/* Toggle periodo */}
      <PeriodToggle active={period} onChange={setPeriod} />

      {/* Tarjeta ingresos */}
      <View style={[styles.card, styles.incomeCard]}>
        <Text style={styles.cardLabel}>Ingresos de esta {period}</Text>
        <Text style={styles.incomeAmount}>${income.toFixed(2)}</Text>
        <Text style={styles.cardSub}>Tu ingreso total de esta {period}</Text>
      </View>

      {/* ── Fila de 3 tarjetas — cambia a columna en pantallas pequeñas ── */}
      <View
        style={[
          styles.cardsContainer,
          isNarrow ? styles.cardsColumn : styles.cardsRow,
        ]}
      >
        {/* Gastos fijos */}
        <View style={[styles.card, isNarrow ? styles.cardFull : styles.cardFlex]}>
          <Text style={styles.cardLabel}>Gastos Fijos</Text>
          <View style={styles.amountRow}>
            <Text style={styles.cardAmount}>${gastosFijos.toFixed(2)}</Text>
            <Text style={styles.cardAmountMuted}> / ${income.toFixed(2)}</Text>
          </View>
          <ProgressBar value={gastosFijos} max={income} color={COLORS.orange} />
          <Text style={styles.percentText}>
            Representan el {pctGastos}% de tus ingresos.
          </Text>
          {pctGastos > 80 && (
            <WarningAlert text="Tus gastos fijos son muy altos." />
          )}
        </View>

        {/* Ahorros */}
        <View
          style={[
            styles.card,
            styles.savingsCard,
            isNarrow ? styles.cardFull : styles.cardFlex,
          ]}
        >
          <Text style={styles.cardLabel}>Ahorros</Text>
          {ahorros === 0 ? (
            <>
              <Text style={styles.emptyText}>
                ¿Aún no te propones ningún ahorro?
              </Text>
              <TouchableOpacity style={styles.adjustBtn} activeOpacity={0.75}>
                <Text style={styles.adjustBtnText}>⚙ Ajustar Metas</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.amountRow}>
                <Text style={styles.cardAmount}>${ahorros}</Text>
              </View>
              <ProgressBar value={ahorros} max={income} color={COLORS.primary} />
            </>
          )}
        </View>

        {/* Dinero disponible */}
        <View style={[styles.card, isNarrow ? styles.cardFull : styles.cardFlex]}>
          <Text style={[styles.cardLabel, { fontSize: 12 }]}>
            Dinero disponible para ahorros y gastos hormiga
          </Text>
          <Text style={styles.cardAmount}>${disponible.toFixed(2)}</Text>
          <ProgressBar value={disponible} max={income} color={COLORS.primary} />
          <Text style={styles.percentText}>
            Representa el {pctDisponible}% de tus ingresos.
          </Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.botonesConteiner}>
        <MyButton
          size={350}
          type="primary"
          text="Ver historial"
          align="left"
          onPress={async () => console.log("historial")}
        />
        <MyButton
          size={350}
          type="secondary"
          text="Registrar Ingreso"
          align="left"
          onPress={async () => console.log("ingreso")}
        />
        <MyButton
          size={350}
          type="secondary"
          text="Agregar Gasto"
          align="left"
          onPress={async () => console.log("gasto")}
        />
        <MyButton
          size={350}
          type="secondary"
          text="Ajustar metas"
          align="left"
          onPress={async () => console.log("metas")}
        />
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 10,
  },

  // Contenedor de las 3 cards
  cardsContainer: {
    marginTop: 16,
    gap: 12,
  },
  cardsRow: {
    flexDirection: "row",      // pantallas anchas: en fila
    alignItems: "flex-start",  // cada card toma su propia altura
  },
  cardsColumn: {
    flexDirection: "column",   // pantallas angostas: en columna
  },

  // Tamaño de cada card según modo
  cardFlex: {
    flex: 1,       // en fila: reparten el espacio proporcionalmente
  },
  cardFull: {
    width: "100%", // en columna: ancho completo
  },

  // Base de todas las cards
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  incomeCard: {
    marginTop: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  savingsCard: {
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    marginVertical: 4,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  cardAmountMuted: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  percentText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 18,
  },
  adjustBtn: {
    backgroundColor: "#F2F4F7",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  adjustBtnText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  botonesConteiner: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
});