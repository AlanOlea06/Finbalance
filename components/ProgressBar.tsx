import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  step: number;
  totalSteps?: number;
  percentage: string;
}

export default function ProgressBar({
  step,
  totalSteps = 4,
  percentage,
}: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          Paso {step} de {totalSteps}
        </Text>
        <Text style={styles.progressText}>{percentage}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: percentage as any }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 30, width: "100%" },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  progressBarBg: {
    height: 6,
    backgroundColor: "#0B6D60",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#FFF", borderRadius: 3 },
});
