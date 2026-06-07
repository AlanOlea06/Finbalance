import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function CustomCheckbox({
  label,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onChange}
      activeOpacity={0.8}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#0F8B7B" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#A3D5CE",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  boxChecked: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  label: { color: "#FFF", fontSize: 14 },
});
