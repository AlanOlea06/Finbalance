import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MyButton } from '../../components/ui/boton';
import { Transaction, transactionsService } from '../../lib/transactionsService';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      const data = await transactionsService.getTransactions();
      setTransactions(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await transactionsService.deleteTransaction(id);
            load();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete transaction');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <MyButton
        size={180}
        type="primary"
        text="Agregar transacción"
        align="left"
        onPress={() => router.push('/transaction/new')}
      />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/transaction/${item.id}`)}
          >
            <View>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.sub}>{item.date} • {item.category}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.amt}>
                {item.type === 'ingreso' ? '+' : '-'}${item.amount}
              </Text>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
  },
  desc: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 12, color: '#666' },
  rightColumn: { alignItems: 'flex-end' },
  amt: { fontSize: 16, fontWeight: 'bold' },
  deleteButton: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#ff6b6b', borderRadius: 6 },
  deleteText: { color: '#fff', fontWeight: '600' },
});
