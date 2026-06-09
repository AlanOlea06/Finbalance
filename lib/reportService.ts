import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// Cambia esta URL por la URL de producción o tu IP local cuando pruebes en un dispositivo físico.
// Para simulador iOS: http://localhost:3000
// Para emulador Android: http://10.0.2.2:3000
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const reportService = {
  async downloadMonthlyReport() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      }

      const fileName = `Reporte_Finbalance_${new Date().getTime()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        `${API_URL}/api/reportes/mensual`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (!result || result.status !== 200) {
        throw new Error('Error al generar el reporte en el servidor.');
      }

      // Compartir el archivo generado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Tu reporte mensual de Finbalance',
          UTI: 'com.adobe.pdf',
        });
      } else {
        throw new Error('La función de compartir no está disponible en este dispositivo');
      }

      return result.uri;
    } catch (error) {
      console.error('Error descargando el reporte:', error);
      throw error;
    }
  },
};
