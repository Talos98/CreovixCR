import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {

    async exportCitas(citas: any[], fileName: string): Promise<void> {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Citas');

        // Fila 1: Título
        worksheet.mergeCells('A1:G1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'Reporte de Citas - CreovixCR';
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C3C2C' } };
        titleCell.alignment = { horizontal: 'center' };

        // Fila 2: Fecha de generación
        worksheet.mergeCells('A2:G2');
        const dateCell = worksheet.getCell('A2');
        dateCell.value = `Fecha de generación: ${new Date().toLocaleDateString('es-CR')}`;
        dateCell.font = { italic: true, size: 11 };

        // Fila 4: Encabezados de columnas
        const headers = ['#', 'Cliente', 'Profesional', 'Servicio', 'Fecha', 'Hora', 'Estado'];
        const headerRow = worksheet.addRow([]); // fila 3 vacía
        const colRow = worksheet.addRow(headers);
        colRow.eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C3C2C' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                bottom: { style: 'thin' }
            };
        });

        // Filas de datos
        citas.forEach((cita, i) => {
            worksheet.addRow([
                i + 1,
                cita.client?.name ?? '',
                cita.professional?.name ?? '',
                cita.service?.name ?? '',
                new Date(cita.date).toLocaleDateString('es-CR'),
                new Date(cita.startTime).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
                cita.status
            ]);
        });

        // Ancho de columnas
        worksheet.columns = [
            { width: 5 },   // #
            { width: 25 },  // Cliente
            { width: 25 },  // Profesional
            { width: 30 },  // Servicio
            { width: 15 },  // Fecha
            { width: 12 },  // Hora
            { width: 15 },  // Estado
        ];

        // Generar y descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${fileName}.xlsx`);
    }
}