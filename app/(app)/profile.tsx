import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton } from '../../components/ui/boton';
import { getCurrentUserProfile, updateUserProfile, UserProfile } from '../../lib/userService';

const useTypes = [
  { value: 'personal', label: 'Personal' },
  { value: 'negocio', label: 'Negocio' },
] as const;

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [moneda, setMoneda] = useState('');
  const [useType, setUseType] = useState<UserProfile['use_type']>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUserProfile();
        setProfile(data);
        setNombre(data.nombre ?? '');
        setPais(data.pais ?? '');
        setCiudad(data.ciudad ?? '');
        setMoneda(data.moneda ?? '');
        setUseType(data.use_type);
      } catch (error: any) {
        Alert.alert('Error', error?.message ?? 'No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await updateUserProfile(profile.id, {
        nombre: nombre.trim(),
        pais: pais.trim() || undefined,
        ciudad: ciudad.trim() || undefined,
        moneda: moneda.trim() || undefined,
        use_type: useType,
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          style={styles.input}
        />

        <Text style={styles.label}>País</Text>
        <TextInput
          value={pais}
          onChangeText={setPais}
          placeholder="País"
          style={styles.input}
        />

        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          value={ciudad}
          onChangeText={setCiudad}
          placeholder="Ciudad"
          style={styles.input}
        />

        <Text style={styles.label}>Moneda</Text>
        <TextInput
          value={moneda}
          onChangeText={setMoneda}
          placeholder="Moneda"
          style={styles.input}
        />

        <Text style={styles.label}>Tipo de uso</Text>
        <View style={styles.optionRow}>
          {useTypes.map((option) => (
            <MyButton
              key={option.value}
              size={150}
              type={useType === option.value ? 'primary' : 'secondary'}
              text={option.label}
              align="left"
              onPress={() => setUseType(option.value)}
            />
          ))}
        </View>

        <MyButton
          size={350}
          type="primary"
          text={saving ? 'Guardando...' : 'Guardar cambios'}
          align="center"
          onPress={handleSave}
          disabled={saving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#0C9488', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 12 },
  input: {
    height: 50,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
  },
  loadingText: { fontSize: 16, color: '#64748B' },
});
