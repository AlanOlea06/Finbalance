import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { COLORS } from "../../constants/colors";

const CARDS_BREAKPOINT = 580;  // resumen general: fila → columna
const STATS_BREAKPOINT = 420;  // stat cards: 4 en fila → 2x2

// ── Tipos ──────────────────────────────────────────────────────────
type MonthReport = {
	id: number;
	month: string;
	ingresos: number;
	gastos: number;
	ahorros: number;
	balance: number;
};


const MOCK_REPORTS: MonthReport[] = [
	// Vacío para mostrar el estado de error/vacío como en la imagen
];

function ErrorBanner({
	message,
	onDismiss,
}: {
	message: string;
	onDismiss: () => void;
}) {
	return (
		<View style={bannerStyles.container}>
			<View style={bannerStyles.content}>
				<Text style={bannerStyles.label}>Error: </Text>
				<Text style={bannerStyles.message}>{message}</Text>
			</View>
			<TouchableOpacity onPress={onDismiss} activeOpacity={0.7}>
				<Text style={bannerStyles.close}>✕</Text>
			</TouchableOpacity>
		</View>
	);
}
const bannerStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: COLORS.dangerBg,
		borderWidth: 1,
		borderColor: COLORS.dangerBorder,
		borderRadius: 8,
		padding: 12,
		marginBottom: 20,
	},
	content: { 
		flexDirection: "row",
		flex: 1,
		flexWrap: "wrap" 
	},
	label: { 
		color: COLORS.danger,
		fontWeight: "700",
		fontSize: 14
	},
	message: { 
		color: COLORS.danger,
		fontSize: 14,
		flex: 1
	},
	close: {
		color: COLORS.danger,
		fontSize: 16,
		fontWeight: "700",
		paddingLeft: 12
	},
});

type StatCardProps = {
	label: string;
	value: number;
	color: string;
	icon: string;
	note?: string;
	style?: object;
};
function StatCard({ label, value, color, icon, note, style }: StatCardProps) {
	return (
		<View style={[statStyles.card, style]}>
			<View style={statStyles.header}>
				<Text style={statStyles.label}>{label}</Text>
				<Text style={statStyles.icon}>{icon}</Text>
			</View>
			<Text style={[statStyles.value, { color }]}>
				${value.toFixed(2)}
			</Text>
			{note && <Text style={statStyles.note}>{note}</Text>}
		</View>
	);
}
const statStyles = StyleSheet.create({
	card: {
		backgroundColor: COLORS.white,
		borderRadius: 10,
		padding: 14,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 3,
		elevation: 2,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	label: {
		fontSize: 12,
		color: COLORS.textMuted,
		fontWeight: "500",
		flex: 1
	},
	icon: {
		fontSize: 16
	},
	value: {
		fontSize: 22,
		fontWeight: "700"
	},
	note: {
		fontSize: 11,
		color: COLORS.textMuted,
		marginTop: 2 
	},
});

function YearPicker({
	year,
	onChange,
}: {
	year: number;
	onChange: (y: number) => void;
}) {
	const currentYear = new Date().getFullYear();
	return (
		<View style={yearStyles.container}>
			<Text style={yearStyles.filterLabel}>▼  Filtrar por año:</Text>
			<View style={yearStyles.controls}>
				<TouchableOpacity
					onPress={() => onChange(year - 1)}
					style={yearStyles.arrowBtn}
					activeOpacity={0.7}
				>
					<Text style={yearStyles.arrow}>‹</Text>
				</TouchableOpacity>
				<View style={yearStyles.yearBox}>
					<Text style={yearStyles.yearText}>{year}</Text>
				</View>
				<TouchableOpacity
					onPress={() => onChange(Math.min(year + 1, currentYear))}
					style={[
						yearStyles.arrowBtn,
						year >= currentYear && yearStyles.arrowDisabled,
					]}
					activeOpacity={0.7}
					disabled={year >= currentYear}
				>
					<Text style={yearStyles.arrow}>›</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
const yearStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 20,
		flexWrap: "wrap",
	},
	filterLabel: {
		fontSize: 14,
		color: COLORS.textMuted,
		fontWeight: "500",
	},
	controls: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.white,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
		overflow: "hidden",
	},
	arrowBtn: {
		paddingHorizontal: 14,
		paddingVertical: 8,
	},
	arrowDisabled: {
		opacity: 0.3 
	},
	arrow: {
		fontSize: 18,
		color: COLORS.textDark,
		fontWeight: "600"
	},
	yearBox: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: COLORS.border,
	},
	yearText: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textDark
	},
});

// ────────────────────────────────────────────────────────────────────
// Componente: Tarjeta de reporte mensual
// ────────────────────────────────────────────────────────────────────
function MonthReportCard({ report }: { report: MonthReport }) {
	const balance = report.balance;
	const balanceColor = balance >= 0 ? COLORS.success : COLORS.danger;

	return (
		<View style={reportCardStyles.container}>
			<View style={reportCardStyles.header}>
				<Text style={reportCardStyles.month}>{report.month}</Text>
				<Text style={[reportCardStyles.balance, { color: balanceColor }]}>
					{balance >= 0 ? "+" : ""}${balance.toFixed(2)}
				</Text>
			</View>
			<View style={reportCardStyles.stats}>
				<View style={reportCardStyles.stat}>
					<Text style={reportCardStyles.statLabel}>Ingresos</Text>
					<Text style={[reportCardStyles.statValue, { color: COLORS.success }]}>
						${report.ingresos.toFixed(2)}
					</Text>
				</View>
				<View style={reportCardStyles.divider} />
				<View style={reportCardStyles.stat}>
					<Text style={reportCardStyles.statLabel}>Gastos</Text>
					<Text style={[reportCardStyles.statValue, { color: COLORS.danger }]}>
						${report.gastos.toFixed(2)}
					</Text>
				</View>
				<View style={reportCardStyles.divider} />
				<View style={reportCardStyles.stat}>
					<Text style={reportCardStyles.statLabel}>Ahorros</Text>
					<Text style={[reportCardStyles.statValue, { color: COLORS.primary }]}>
						${report.ahorros.toFixed(2)}
					</Text>
				</View>
			</View>
		</View>
	);
}
const reportCardStyles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 3,
		elevation: 2,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	month: {
		fontSize: 15,
		fontWeight: "700",
		color: COLORS.textDark
	},
	balance: {
		fontSize: 15,
		fontWeight: "700"
	},
	stats: {
		flexDirection: "row",
		alignItems: "center"
	},
	stat: {
		flex: 1,
		alignItems: "center"
	},
	statLabel: {
		fontSize: 11,
		color: COLORS.textMuted,
		marginBottom: 2
	},
	statValue: {
		fontSize: 13,
		fontWeight: "600"
	},
	divider: {
		width: 1,
		height: 30,
		backgroundColor: COLORS.border
	},
});

export default function HistorialFinanciero() {
	const { width } = useWindowDimensions();
	const isNarrow = width < CARDS_BREAKPOINT;
	const isVeryNarrow = width < STATS_BREAKPOINT;

	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [bannerVisible, setBannerVisible] = useState(true);

	// En progreso (errores simulados)
	const hasTopError = true;          // Error del banner superior
	const reportsError = true;         // Error al cargar reportes
	const isLoading = false;
	const mesesRegistrados = 0;

	const summary = {
		ingresosTotales: 0,
		gastosTotales: 0,
		ahorrosTotales: 0,
		balancePromedio: 0,
	};

	const reports: MonthReport[] = MOCK_REPORTS;

	const statCardStyle = isVeryNarrow
		? { width: "100%" }
		: isNarrow
			? { width: "47%" }
			: { flex: 1 };

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

			<Text style={styles.title}>Historial Financiero</Text>
			<Text style={styles.subtitle}>
				Revisa tu progreso financiero mes a mes desde que creaste tu cuenta.
			</Text>

			{hasTopError && bannerVisible && (
				<ErrorBanner
					message="Error 500: Internal Server Error"
					onDismiss={() => setBannerVisible(false)}
				/>
			)}

			{/* ── Resumen General ── */}
			<View style={styles.card}>
				{/* Cabecera del resumen */}
				<View style={[
					styles.resumenHeader,
					isNarrow && styles.resumenHeaderNarrow,
				]}>
					<Text style={styles.resumenTitle}>Resumen General</Text>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							{mesesRegistrados} meses registrados
						</Text>
					</View>
				</View>

				{/* Grid de 4 stat cards */}
				<View style={[
					styles.statsGrid,
					isNarrow && styles.statsGridWrap,
				]}>
					<StatCard
						label="Ingresos Totales"
						value={summary.ingresosTotales}
						color={COLORS.success}
						icon="📈"
						style={statCardStyle}
					/>
					<StatCard
						label="Gastos Totales"
						value={summary.gastosTotales}
						color={COLORS.danger}
						icon="📉"
						style={statCardStyle}
					/>
					<StatCard
						label="Ahorros Totales"
						value={summary.ahorrosTotales}
						color={COLORS.primary}
						icon="💹"
						style={statCardStyle}
					/>
					<StatCard
						label="Balance Promedio"
						value={summary.balancePromedio}
						color={COLORS.textDark}
						icon="📊"
						note="Por mes"
						style={statCardStyle}
					/>
				</View>
			</View>

			<YearPicker year={selectedYear} onChange={setSelectedYear} />

			<Text style={styles.sectionTitle}>Reportes de {selectedYear}</Text>

			{isLoading ? (
				<View style={styles.stateBox}>
					<Text style={styles.stateText}>Cargando reportes...</Text>
				</View>
			) : reportsError ? (
				<View style={styles.stateBox}>
					<Text style={styles.stateTextMuted}>Error al cargar los reportes</Text>
				</View>
			) : reports.length === 0 ? (
				<View style={styles.stateBox}>
					<Text style={styles.stateTextMuted}>
						No hay reportes registrados para {selectedYear}.
					</Text>
				</View>
			) : (
				reports.map((report) => (
					<MonthReportCard key={report.id} report={report} />
				))
			)}

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
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: COLORS.textMuted,
		marginBottom: 20,
		lineHeight: 20,
	},

	// Card contenedora del resumen
	card: {
		backgroundColor: COLORS.white,
		borderRadius: 14,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},

	// Header del resumen general
	resumenHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	resumenHeaderNarrow: {
		flexDirection: "column",
		alignItems: "flex-start",
		gap: 8,
	},
	resumenTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: COLORS.textDark,
	},
	badge: {
		backgroundColor: COLORS.successBg,
		borderRadius: 20,
		paddingVertical: 4,
		paddingHorizontal: 10,
	},
	badgeText: {
		fontSize: 12,
		fontWeight: "600",
		color: COLORS.success,
	},

	// Grid de estadísticas
	statsGrid: {
		flexDirection: "row",
		gap: 10,
	},
	statsGridWrap: {
		flexWrap: "wrap",    // en pantallas angostas: hace el 2x2
	},

	// Sección de reportes
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: COLORS.textDark,
		marginBottom: 16,
	},

	// Estado vacío / error / cargando
	stateBox: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		padding: 32,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 3,
		elevation: 2,
	},
	stateText: {
		fontSize: 14,
		color: COLORS.textDark,
		fontWeight: "500",
	},
	stateTextMuted: {
		fontSize: 14,
		color: COLORS.textMuted,
	},
});