import express, { Request, Response } from "express";
import PDFDocument from "pdfkit";

interface Transaccion {
  fecha: string;
  tipo: "Ingreso" | "Egreso";
  categoria: string;
  descripcion: string;
  monto: number;
}

interface CabeceraReporte {
  periodo: string;
  generadoPor: string;
}

class ReporteFinancieroPdf {
  private doc: PDFDocument;

  constructor(private response: Response, private title: string) {
    this.doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
    this.response.setHeader("Content-Type", "application/pdf");
    this.response.setHeader(
      "Content-Disposition",
      `attachment; filename="${this.generateFilename()}"`
    );
    this.doc.pipe(this.response);
  }

  generarCabecera(options: CabeceraReporte) {
    this.doc.fontSize(20).font("Helvetica-Bold").text("FinBalance", { align: "center" });
    this.doc.fontSize(14).font("Helvetica").text("Reporte Financiero", { align: "center" });
    this.doc.moveDown(1);

    this.doc.fontSize(11).font("Helvetica-Bold").text("Periodo:", { continued: true });
    this.doc.font("Helvetica").text(` ${options.periodo}`);
    this.doc.font("Helvetica-Bold").text("Generado:", { continued: true });
    this.doc.font("Helvetica").text(` ${this.formatDate(new Date())}`);
    this.doc.font("Helvetica-Bold").text("Usuario:", { continued: true });
    this.doc.font("Helvetica").text(` ${options.generadoPor}`);
    this.doc.moveDown(0.7);

    this.doc.strokeColor("#4b5563").lineWidth(1).moveTo(40, this.doc.y).lineTo(555, this.doc.y).stroke();
    this.doc.moveDown(1);
  }

  generarTabla(transacciones: Transaccion[]) {
    const columnPositions = {
      fecha: 40,
      tipo: 110,
      categoria: 180,
      descripcion: 260,
      monto: 470,
    };

    this.doc.fontSize(11).font("Helvetica-Bold");
    this.doc.text("Fecha", columnPositions.fecha);
    this.doc.text("Tipo", columnPositions.tipo);
    this.doc.text("Categoría", columnPositions.categoria);
    this.doc.text("Descripción", columnPositions.descripcion);
    this.doc.text("Monto", columnPositions.monto, { width: 80, align: "right" });

    this.doc.moveDown(0.5);
    this.doc.strokeColor("#d1d5db").lineWidth(0.5).moveTo(40, this.doc.y).lineTo(555, this.doc.y).stroke();
    this.doc.moveDown(0.5);

    this.doc.fontSize(10).font("Helvetica");
    transacciones.forEach((transaccion) => {
      this.ensurePageSpace(60);
      const rowY = this.doc.y;

      this.doc.text(transaccion.fecha, columnPositions.fecha, rowY);
      this.doc.text(transaccion.tipo, columnPositions.tipo, rowY);
      this.doc.text(transaccion.categoria, columnPositions.categoria, rowY);
      this.doc.text(transaccion.descripcion, columnPositions.descripcion, rowY, { width: 200 });
      this.doc.text(this.formatCurrency(transaccion.monto), columnPositions.monto, rowY, {
        width: 80,
        align: "right",
      });

      this.doc.moveDown(0.8);
    });
  }

  generarResumen(transacciones: Transaccion[]) {
    const ingresos = transacciones
      .filter((item) => item.tipo === "Ingreso")
      .reduce((total, item) => total + item.monto, 0);
    const egresos = transacciones
      .filter((item) => item.tipo === "Egreso")
      .reduce((total, item) => total + item.monto, 0);
    const saldo = ingresos - egresos;

    this.doc.moveDown(1);
    this.doc.font("Helvetica-Bold").fontSize(12).text("Resumen financiero");
    this.doc.moveDown(0.3);

    this.doc.font("Helvetica").fontSize(11);
    this.doc.text(`Total ingresos: ${this.formatCurrency(ingresos)}`);
    this.doc.text(`Total egresos: ${this.formatCurrency(egresos)}`);
    this.doc.text(`Saldo neto: ${this.formatCurrency(saldo)}`);

    this.doc.moveDown(0.5);
    this.doc.font("Helvetica-Oblique").fontSize(10).fillColor("#4b5563");
    this.doc.text(saldo >= 0 ? "Flujo de caja positivo" : "Flujo de caja negativo");
  }

  finalizar() {
    this.doc.end();
  }

  private generateFilename() {
    const safeTitle = this.title.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    return `${safeTitle}_${new Date().toISOString().slice(0, 10)}.pdf`;
  }

  private formatCurrency(value: number) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatDate(date: Date) {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  private ensurePageSpace(requiredSpace: number) {
    if (this.doc.y > this.doc.page.height - this.doc.page.margins.bottom - requiredSpace) {
      this.doc.addPage();
      this.doc.moveDown(0.5);
    }
  }
}

async function obtenerTransacciones(mes: string, anio: string): Promise<Transaccion[]> {
  return [
    {
      fecha: `${mes}/01/${anio}`,
      tipo: "Ingreso",
      categoria: "Servicios",
      descripcion: "Consultoría de finanzas",
      monto: 18500,
    },
    {
      fecha: `${mes}/05/${anio}`,
      tipo: "Egreso",
      categoria: "Operativo",
      descripcion: "Pago de nómina",
      monto: 5600,
    },
    {
      fecha: `${mes}/10/${anio}`,
      tipo: "Egreso",
      categoria: "Marketing",
      descripcion: "Campaña digital",
      monto: 2000,
    },
    {
      fecha: `${mes}/15/${anio}`,
      tipo: "Ingreso",
      categoria: "Inversión",
      descripcion: "Rendimiento de portafolio",
      monto: 4200,
    },
    {
      fecha: `${mes}/22/${anio}`,
      tipo: "Egreso",
      categoria: "Administración",
      descripcion: "Herramientas SaaS",
      monto: 950,
    },
  ];
}

function validarMes(mes: string) {
  return /^(0[1-9]|1[0-2])$/.test(mes);
}

const app = express();

app.get("/api/reportes/financieros", async (req: Request, res: Response) => {
  try {
    const mes = typeof req.query.mes === "string" ? req.query.mes : "01";
    const anio = typeof req.query.anio === "string" ? req.query.anio : new Date().getFullYear().toString();

    if (!validarMes(mes)) {
      return res.status(400).json({ error: "El parámetro 'mes' debe ser un valor entre 01 y 12." });
    }

    const transacciones = await obtenerTransacciones(mes, anio);
    const reporte = new ReporteFinancieroPdf(res, `Reporte Financieros ${mes}-${anio}`);
    reporte.generarCabecera({ periodo: `${mes}/${anio}`, generadoPor: "FinBalance" });
    reporte.generarTabla(transacciones);
    reporte.generarResumen(transacciones);
    reporte.finalizar();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error interno al generar el reporte financiero." });
    }
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor de PDF listo en http://localhost:${PORT}/api/reportes/financieros`);
  });
}

export default app;
