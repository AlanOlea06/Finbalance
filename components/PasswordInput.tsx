import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface PasswordProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  hasError?: boolean;
}

export default function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder = "••••••••",
  showStrength = false,
  hasError = false,
}: PasswordProps) {
  const [show, setShow] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/(?=.*[a-z])/.test(password)) strength += 25;
    if (/(?=.*[A-Z])/.test(password)) strength += 25;
    if (/(?=.*\d)/.test(password)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(value);

  let strengthColor = "#e0e0e0";
  let strengthText = "";

  if (value.length > 0) {
    if (strength <= 25) {
      strengthColor = "#ef4444";
      strengthText = "Débil";
    } else if (strength <= 50) {
      strengthColor = "#eab308";
      strengthText = "Regular";
    } else if (strength <= 75) {
      strengthColor = "#3b82f6";
      strengthText = "Buena";
    } else {
      strengthColor = "#22c55e";
      strengthText = "Fuerte";
    }
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, hasError && styles.inputError]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShow(!show)} activeOpacity={0.7}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {showStrength && value.length > 0 && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBarBg}>
            <View
              style={[
                styles.strengthBarFill,
                { width: `${strength}%`, backgroundColor: strengthColor },
              ]}
            />
          </View>
          <Text style={[styles.strengthTextLabel, { color: strengthColor }]}>
            {strengthText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { color: "#FFF", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputError: { borderColor: "#ef4444" },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: "#333",
    fontSize: 15,
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  strengthBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthBarFill: { height: "100%", borderRadius: 3 },
  strengthTextLabel: {
    fontSize: 12,
    fontWeight: "bold",
    width: 50,
    textAlign: "right",
  },
});
