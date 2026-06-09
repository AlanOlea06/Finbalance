const express = require('express');
const PDFDocument = require('pdfkit');
// import { TransaccionRepository } from './tu_modulo_db';

const app = express();

// Clase orientada a objetos para manejar la lógica del PDF
class ReporteFinBalance {
    constructor(response) {
        // Inicializamos el documento con márgenes
        this.doc = new PDFDocument({ margin: 50 });
        
        // ¡Magia de Node.js! Conectamos el documento directamente a la respuesta HTTP
        this.doc.pipe(response);
    }

    generarCabecera() {
        this.doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .text('FinBalance - Reporte Financiero', { align: 'center' });
        
        this.doc.moveDown(2); // Salto de línea
    }

    generarTabla(transacciones) {
        this.doc.fontSize(12).font('Helvetica-Bold');
        
        // Cabeceras de la tabla
        this.doc.text('Tipo', 50, this.doc.y, { continued: true });
        this.doc.text('Descripción', 150, this.doc.y, { continued: true });
        this.doc.text('Monto', 400, this.doc.y);
        
        this.doc.moveDown(0.5);
        this.doc.moveTo(50, this.doc.y).lineTo(500, this.doc.y).stroke(); // Línea separadora
        this.doc.moveDown(0.5);

        // Filas de datos
        this.doc.font('Helvetica');
        transacciones.forEach(t => {
            const y = this.doc.y;
            this.doc.text(t.tipo, 50, y);
            this.doc.text(t.descripcion, 150, y);
            this.doc.text(`$${t.monto}`, 400, y);
            this.doc.moveDown(0.5);
        });
    }

    finalizar() {
        // Termina de escribir el documento y cierra el stream
        this.doc.end();
    }
}

// Endpoint de la API
app.get('/api/reportes/mensual', async (req, res) => {
    try {
        // 1. Configurar las cabeceras HTTP para forzar la descarga del PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_finbalance.pdf');

        // 2. Obtener datos de MySQL (Simulado aquí)
        // const db = new TransaccionRepository();
        // const transacciones = await db.obtenerPorMes('05');
        const transacciones = [
            { tipo: 'Ingreso', descripcion: 'Desarrollo Web Freelance', monto: 15000 },
            { tipo: 'Egreso', descripcion: 'Suscripciones Cloud', monto: 800 },
            { tipo: 'Egreso', descripcion: 'Gasolina Honda', monto: 1200 }
        ];

        // 3. Instanciar la clase y generar el reporte
        const reporte = new ReporteFinBalance(res);
        reporte.generarCabecera();
        reporte.generarTabla(transacciones);
        reporte.finalizar();

    } catch (error) {
        console.error("Error generando el PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "No se pudo generar el reporte" });
        }
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});