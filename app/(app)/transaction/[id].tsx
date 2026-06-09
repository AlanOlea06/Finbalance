import { useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MyButton } from '../../../components/ui/boton';
import { Transaction, transactionsService } from '../../../lib/transactionsService';

export default function TransactionDetailScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const transactionId = String(params.id ?? '');

  useEffect(() => {
    const loadTransaction = async () => {
      if (!transactionId) return;
      setLoading(true);

      try {
        const data = await transactionsService.getTransactionById(transactionId);
        setTransaction(data);
      } catch (error: any) {
        Alert.alert('Error', error?.message ?? 'No se pudo cargar la transacción.', [
          { text: 'Aceptar', onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

  const handleDelete = async () => {
    if (!transactionId) return;
    Alert.alert('Eliminar', '¿Eliminar esta transacción?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await transactionsService.deleteTransaction(transactionId);
            Alert.alert('Eliminado', 'Transacción eliminada correctamente.');
            router.replace('/transactions');
          } catch (error: any) {
            Alert.alert('Error', error?.message ?? 'No se pudo eliminar la transacción.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando transacción...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detalle de transacción</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.value}>{transaction.description}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Monto</Text>
          <Text style={styles.value}>${transaction.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Tipo</Text>
          <Text style={styles.value}>{transaction.type}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <Text style={styles.value}>{transaction.category}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>{transaction.date}</Text>
        </View>
        <MyButton
          size={350}
          type="secondary"
          text={deleting ? 'Eliminando...' : 'Eliminar transacción'}
          align="center"
          onPress={handleDelete}
          disabled={deleting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0C9488', marginBottom: 20 },
  field: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  value: { fontSize: 16, color: '#111827', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F4F7' },
  loadingText: { color: '#64748B', fontSize: 16 },
});
