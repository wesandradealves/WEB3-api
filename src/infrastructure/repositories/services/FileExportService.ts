import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';

export enum FileFormat {
  EXCEL = 'excel',
  CSV = 'csv',
  NONE = 'none',
}

@Injectable()
export class FileExportService {
  /**
   * Exporta dados para formato Excel
   */
  async exportToExcel(data: any[], filename: string, response: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');
    
    if (data.length > 0) {
      // Adiciona cabeçalhos baseados nos campos do resultado
      const headers = Object.keys(data[0] || {});
      worksheet.addRow(headers);
      
      // Adiciona linhas de dados
      data.forEach(item => {
        worksheet.addRow(Object.values(item));
      });
    }
    
    // Configura headers da resposta
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
    
    // Escreve para o response stream
    await workbook.xlsx.write(response);
    response.end();
  }

  /**
   * Exporta dados para formato CSV
   */
  async exportToCSV(data: any[], filename: string, response: Response): Promise<void> {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    
    if (data.length > 0) {
      const parser = new Parser({ fields: Object.keys(data[0]) });
      const csv = parser.parse(data);
      response.send(csv);
    } else {
      response.send('');
    }
  }
}