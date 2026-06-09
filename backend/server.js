require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class ReporteFinBalance {
  constructor(response) {
    this.doc = new PDFDocument({ margin: 50 });
    this.doc.pipe(response);
  }

  generarCabecera(userName, mes) {
    this.doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#005b96')
      .text('FinBalance', { align: 'center' });
      
    this.doc
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#333333')
      .text(`Reporte Financiero - ${mes}`, { align: 'center' });

    this.doc.moveDown();
    this.doc.fontSize(12).text(`Usuario: ${userName}`);
    this.doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`);
    this.doc.moveDown(2);
  }

  generarTabla(titulo, data, total) {
    this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text(titulo);
    this.doc.moveDown(0.5);

    // Cabeceras de la tabla
    this.doc.fontSize(11).font('Helvetica-Bold');
    this.doc.text('Descripción', 50, this.doc.y, { continued: true });
    this.doc.text('Fecha', 300, this.doc.y, { continued: true });
    this.doc.text('Monto', 450, this.doc.y);
    
    this.doc.moveDown(0.5);
    this.doc.moveTo(50, this.doc.y).lineTo(520, this.doc.y).stroke();
    this.doc.moveDown(0.5);

    // Filas
    this.doc.font('Helvetica');
    if (data.length === 0) {
      this.doc.text('No hay registros en este periodo.', 50, this.doc.y);
      this.doc.moveDown(1);
    } else {
      data.forEach(item => {
        const y = this.doc.y;
        this.doc.text(item.descripcion, 50, y);
        this.doc.text(item.fecha || '-', 300, y);
        this.doc.text(`$${item.monto.toFixed(2)}`, 450, y);
        this.doc.moveDown(0.5);
      });
    }

    this.doc.moveDown(0.5);
    this.doc.font('Helvetica-Bold').text(`Total ${titulo}: $${total.toFixed(2)}`, { align: 'right' });
    this.doc.moveDown(2);
  }

  generarResumen(totalIngresos, totalGastos) {
    this.doc.moveTo(50, this.doc.y).lineTo(520, this.doc.y).stroke();
    this.doc.moveDown(1);
    this.doc.fontSize(16).font('Helvetica-Bold').text('Resumen Final', { align: 'right' });
    this.doc.fontSize(14).font('Helvetica').text(`Total Ingresos: $${totalIngresos.toFixed(2)}`, { align: 'right' });
    this.doc.text(`Total Gastos: $${totalGastos.toFixed(2)}`, { align: 'right' });
    
    const balance = totalIngresos - totalGastos;
    this.doc.font('Helvetica-Bold')
      .fillColor(balance >= 0 ? 'green' : 'red')
      .text(`Balance Disponible: $${balance.toFixed(2)}`, { align: 'right' });
  }

  finalizar() {
    this.doc.end();
  }
}

app.get('/api/reportes/mensual', async (req, res) => {
  try {
    // 1. Obtener y verificar el token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // 2. Obtener datos del usuario
    const { data: userProfile } = await supabase
      .from('users')
      .select('nombre')
      .eq('id', user.id) // Ojo: en tu DB, users.email coincide con auth.email, o asume que user.id mapea al id de la tabla users si es uuid.
      .single();
      
    // Como tu tabla users tiene id serial, busquemos por email:
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, nombre')
      .eq('email', user.email)
      .single();

    if (!dbUser) {
      return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
    }

    const userId = dbUser.id;

    // 3. Rango de fechas (Mes actual)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    // 4. Consultar Transacciones
    const { data: transacciones } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)
      .order('date', { ascending: true });

    const ingresosManuales = (transacciones || []).filter(t => t.type === 'ingreso');
    const gastosManuales = (transacciones || []).filter(t => t.type === 'gasto');

    // Mapeo para tabla
    const tablaIngresos = ingresosManuales.map(t => ({ descripcion: t.description, fecha: t.date, monto: parseFloat(t.amount) }));
    const tablaGastos = gastosManuales.map(t => ({ descripcion: t.description, fecha: t.date, monto: parseFloat(t.amount) }));

    const totalIngresos = tablaIngresos.reduce((acc, curr) => acc + curr.monto, 0);
    const totalGastos = tablaGastos.reduce((acc, curr) => acc + curr.monto, 0);

    // 5. Configurar respuesta HTTP para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_Finbalance_${now.getMonth()+1}_${now.getFullYear()}.pdf`);

    // 6. Generar PDF
    const reporte = new ReporteFinBalance(res);
    reporte.generarCabecera(dbUser.nombre, now.toLocaleString('es-ES', { month: 'long', year: 'numeric' }));
    
    reporte.generarTabla('Ingresos del Mes', tablaIngresos, totalIngresos);
    reporte.generarTabla('Gastos del Mes', tablaGastos, totalGastos);
    
    reporte.generarResumen(totalIngresos, totalGastos);
    reporte.finalizar();

  } catch (error) {
    console.error("Error generando el PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "No se pudo generar el reporte" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF corriendo en http://localhost:${PORT}`);
});
