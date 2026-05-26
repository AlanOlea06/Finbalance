import { StyleSheet, Text, View } from "react-native";
import { MyButton } from "../../components/ui/boton";


export default function Dashboard() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido de nuevo</Text>

        <View style={{flexDirection: "row", marginTop: 20}}>
          <Text style={{fontWeight: "bold", backgroundColor: "lightgray", padding: 10, marginRight: 10}}>Semana</Text>
          <Text style={{fontWeight: "bold", backgroundColor: "lightgray", padding: 10}}>Mes</Text>
        </View>
      
        <View style={styles.cart}>
          <Text>Ingresos esta semana</Text>
          <Text>$400</Text>
          <Text>Tu ingreso total esta semana</Text>
        </View>

        <View style={styles.containerCarts}>
          <View style={[styles.cart, {flex: 1}]}>
            <Text>Gastos fijos</Text>
          </View>
          <View style={[styles.cart, {flex: 1}]}>
            <Text>Ahorros</Text>
          </View>
          <View style={[styles.cart, {flex: 1}]}>
            <Text>Dinero disponible para ahoros y gastos hormigas</Text>
          </View>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-around", flex: 1, flexWrap: "wrap"}}>
          <MyButton size= {350} type="primary" text="Ver historial" align="left" onPress={async () => {
            console.log('Button pressed');
          }} />
          <MyButton size= {350} type="secondary" text="Registrar Ingreso" align="left" onPress={async () => {
            console.log('Button pressed');
          }} />
          <MyButton size= {350}  type="secondary" text="Registrar Gasto" align="left" onPress={async () => {
            console.log('Button pressed');
          }} />
          <MyButton size= {350} type="secondary" text="Ajustar Metas" align="left" onPress={async () => {
            console.log('Button pressed');
          }} />
        </View>
      </View>

    </>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  cart: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.30,
    shadowRadius: 3.84,
    elevation: 5
  },
  containerCarts: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});