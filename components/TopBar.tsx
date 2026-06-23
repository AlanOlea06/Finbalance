import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopBar = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.replace(route as Href);
  };

  return (
    <>
    
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.7} style={styles.logoContainer}
            onPress={() => handleNavigation("/(app)/dashboard")}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FFFFFF" }}>
              Finbalance
            </Text>
          </TouchableOpacity>

          <View style={styles.iconsContainer}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#FFFFFF"
              onPress={() => alert("Notificaciones")}
            />
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="#FFFFFF"
              onPress={() => setVisible(true)}
            />
          </View>
          {/* El Dropdown usando un Modal flotante */}
          <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
          >
            {/* Este toque de fondo cierra el menú si tocas fuera de él */}
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
              <View style={{ flex: 1 }}>
                {/* El contenedor del Dropdown */}
                <View style={styles.dropdownContainer}>
                  {/* Contenido del menú */}
                  <View style={styles.dropdownMenu}>
                    <View style={styles.header}>
                      <Text style={styles.name}>Nombre se Usuario</Text>
                      <Text style={styles.email}>cuenta@correo.com</Text>
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => setVisible(false)}
                    >
                      <Text style={styles.menuText}>Mi Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => setVisible(false)}
                    >
                      <Text style={styles.menuText}>Configuración</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        router.push("/");
                      }}
                    >
                      <Text style={[styles.menuText, styles.logoutText]}>
                        Cerrar Sesión
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#0C9488",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50, // Ajusta este número dependiendo de la altura de tu navbar
    right: 16,
    alignItems: "flex-end", // Alinea la flechita a la derecha
  },
  dropdownMenu: {
    backgroundColor: "#ffffff",
    width: 220,
    borderRadius: 8,
    paddingVertical: 8,
    // Sombras para iOS y Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
  },
  logoutText: {
    color: "#dc2626",
    fontWeight: "500",
  },
});

export default TopBar;
