import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Appointment } from '../models/appointment.model';

interface ProfesionalReport {
    nombre: string;
    promedio: number;
    cantidadResenas: number;
    mejorServicio: string;
    serviciosBajos: string[];
}

@Injectable({ providedIn: 'root' })
export class PdfReportService {

    // Umbral de calificación baja: 3.0 o menos sobre 5
    // Justificación: una calificación ≤ 3 indica que el cliente
    // quedó neutral o insatisfecho con el servicio recibido.
    private readonly UMBRAL_BAJA_CALIFICACION = 3.0;

    generarReporteCalificaciones(citas: Appointment[]): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // ===== ENCABEZADO =====
        doc.setFillColor(12, 60, 44); // #0c3c2c
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Calificaciones', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('CreovixCR', pageWidth / 2, 23, { align: 'center' });

        // ===== FECHA DE GENERACIÓN =====
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.text(
            `Fecha de generación: ${new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            14, 40
        );

        // ===== UMBRAL =====
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(
            `Umbral de baja calificacion: menor o igual a ${this.UMBRAL_BAJA_CALIFICACION} de 5`,
            14, 46
        );

        // ===== PROCESAR DATOS =====
        const reportData = this.procesarDatos(citas);

        // ===== TABLA =====
        autoTable(doc, {
            startY: 52,
            head: [[
                'Profesional',
                'Promedio',
                'Reseñas',
                'Mejor servicio calificado',
                'Servicios con baja calificación'
            ]],
            body: reportData.map(r => [
                r.nombre,
                r.cantidadResenas > 0 ? r.promedio.toFixed(1) : 'Sin reseñas',
                r.cantidadResenas.toString(),
                r.mejorServicio,
                r.serviciosBajos.length > 0 ? r.serviciosBajos.join(', ') : 'Ninguno'
            ]),
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: {
                fillColor: [12, 60, 44],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 22, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 50 },
                4: { cellWidth: 55 },
            },
        });

        // ===== DESCARGAR =====
        doc.save('reporte-calificaciones.pdf');
    }

    private procesarDatos(citas: Appointment[]): ProfesionalReport[] {
        // Agrupar citas con review por profesional
        const profesionalesMap = new Map<number, {
            nombre: string;
            reviews: { rating: number; serviceName: string }[];
        }>();

        // Recopilar todos los profesionales (con y sin reseñas)
        for (const cita of citas) {
            if (!cita.professional) continue;

            if (!profesionalesMap.has(cita.professionalId)) {
                profesionalesMap.set(cita.professionalId, {
                    nombre: cita.professional.name,
                    reviews: []
                });
            }

            if (cita.review) {
                profesionalesMap.get(cita.professionalId)!.reviews.push({
                    rating: cita.review.rating,
                    serviceName: cita.service?.name ?? 'Sin nombre'
                });
            }
        }

        // Construir reporte por profesional
        const result: ProfesionalReport[] = [];

        for (const [, data] of profesionalesMap) {
            const { nombre, reviews } = data;

            if (reviews.length === 0) {
                // Profesionales sin reseñas van al final
                result.push({
                    nombre,
                    promedio: 0,
                    cantidadResenas: 0,
                    mejorServicio: 'N/A',
                    serviciosBajos: []
                });
                continue;
            }

            // Promedio general
            const promedio = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

            // Agrupar por servicio para mejor y peores
            const servicioRatings = new Map<string, number[]>();
            for (const r of reviews) {
                if (!servicioRatings.has(r.serviceName)) {
                    servicioRatings.set(r.serviceName, []);
                }
                servicioRatings.get(r.serviceName)!.push(r.rating);
            }

            // Mejor servicio (promedio más alto; en empate, todos los empatados)
            let maxPromedio = -1;
            const mejores: string[] = [];
            for (const [servicio, ratings] of servicioRatings) {
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                if (avg > maxPromedio) {
                    maxPromedio = avg;
                    mejores.length = 0;
                    mejores.push(servicio);
                } else if (avg === maxPromedio) {
                    mejores.push(servicio); // Empate
                }
            }

            // Servicios con baja calificación (promedio ≤ umbral)
            const bajos: string[] = [];
            for (const [servicio, ratings] of servicioRatings) {
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                if (avg <= this.UMBRAL_BAJA_CALIFICACION) {
                    bajos.push(`${servicio} (${avg.toFixed(1)})`);
                }
            }

            result.push({
                nombre,
                promedio: Math.round(promedio * 10) / 10,
                cantidadResenas: reviews.length,
                mejorServicio: mejores.join(', '),
                serviciosBajos: bajos
            });
        }

        // Ordenar: con reseñas primero (mayor promedio arriba), sin reseñas al final
        result.sort((a, b) => {
            if (a.cantidadResenas === 0 && b.cantidadResenas === 0) return 0;
            if (a.cantidadResenas === 0) return 1;
            if (b.cantidadResenas === 0) return -1;
            return b.promedio - a.promedio;
        });

        return result;
    }
}