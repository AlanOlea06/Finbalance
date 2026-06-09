import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Goal, goalsService } from '../../lib/goalsService';
import { MyButton } from './../../components/ui/boton';

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
    </View>
  );
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadGoals = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await goalsService.getGoals();
      setGoals(data);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar las metas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddContribution = (goal: Goal) => {
    const category = goal.type || 'Ahorro';
    const goalNameEncoded = encodeURIComponent(goal.name);
    const categoryEncoded = encodeURIComponent(category);
    router.push(`/(app)/transaction/new?type=gasto&goalName=${goalNameEncoded}&category=${categoryEncoded}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mis metas</Text>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Aún no tienes metas creadas.</Text>
              <Text style={styles.emptyHint}>Registra un ahorro o deuda en transacciones para comenzar.</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const filled = item.current_amount || 0;
            const total = item.total_amount || 0;
            const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={styles.goalType}>{item.type}</Text>
                </View>
                <Text style={styles.goalMeta}>Meta: ${total.toFixed(2)}</Text>
                <Text style={styles.goalMeta}>Logrado: ${filled.toFixed(2)}</Text>
                <ProgressBar value={filled} max={total} />
                <Text style={styles.percentage}>{percentage}% completo</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.targetDate}>Fecha objetivo: {item.target_date}</Text>
                  <MyButton
                    size={160}
                    type="secondary"
                    text="Aportar"
                    align="left"
                    onPress={() => handleAddContribution(item)}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#0C9488', marginBottom: 20 },
  list: { gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  goalName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  goalType: { fontSize: 12, fontWeight: '700', color: '#0C9488' },
  goalMeta: { fontSize: 13, color: '#475569', marginBottom: 4 },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: { height: '100%', backgroundColor: '#0C9488' },
  percentage: { marginTop: 8, fontSize: 12, color: '#64748B', fontWeight: '600' },
  cardFooter: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetDate: { color: '#64748B', fontSize: 12 },
  errorBox: { marginBottom: 16, padding: 14, backgroundColor: '#FEE2E2', borderRadius: 12 },
  errorText: { color: '#991B1B', fontSize: 14 },
  emptyBox: { padding: 24, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#64748B', textAlign: 'center' },
});
