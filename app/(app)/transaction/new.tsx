import { useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton } from '../../../components/ui/boton';
import { transactionsService } from '../../../lib/transactionsService';

const categories = ['Salario', 'Negocio', 'Ahorro', 'Deuda', 'Alimentos', 'Transporte', 'Otros'];

function getDefaultType(value: string | undefined): 'ingreso' | 'gasto' {
  return value === 'gasto' ? 'gasto' : 'ingreso';
}

function getInitialCategory(type: 'ingreso' | 'gasto', categoryParam?: string) {
  if (categoryParam) return categoryParam;
  return type === 'gasto' ? 'Alimentos' : 'Salario';
}

export default function NewTransactionScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const [type, setType] = useState<'ingreso' | 'gasto'>(getDefaultType(params.type as string | undefined));
  const [description, setDescription] = useState(
    params.goalName ? String(params.goalName) : '',
  );
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(
    getInitialCategory(type, params.category as string | undefined),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategory(getInitialCategory(type, params.category as string | undefined));
  }, [type, params.category]);

  useEffect(() => {
    const searchType = getDefaultType(params.type as string | undefined);
    if (searchType !== type) {
      setType(searchType);
    }

    if (params.goalName && params.goalName !== description) {
      setDescription(String(params.goalName));
    }
  }, [params.type]);

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Ingrese una descripción y un monto válido.');
      return;
    }

    setLoading(true);
    try {
      await transactionsService.createTransaction({
        description: description.trim(),
        amount: parsedAmount,
        date,
        category,
        type,
      });
      Alert.alert('Éxito', 'Transacción creada correctamente.');
      router.replace('/transactions');
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo crear la transacción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nueva transacción</Text>
        <View style={styles.switchRow}>
          {(['ingreso', 'gasto'] as const).map((option) => (
            <MyButton
              key={option}
              size={160}
              type={type === option ? 'primary' : 'secondary'}
              text={option === 'ingreso' ? 'Ingreso' : 'Gasto'}
              align="left"
              onPress={() => setType(option)}
            />
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción de la transacción"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <MyButton
          size={350}
          text="Guardar transacción"
          type="primary"
          align="center"
          onPress={handleSubmit}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0C9488',
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    fontSize: 16,
  },
  categoryRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#0C9488',
    borderColor: '#0C9488',
  },
  categoryText: {
    color: '#475569',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#fff',
  },
});
