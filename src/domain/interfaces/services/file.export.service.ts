import { Response } from 'express';

export const IFileExportService = 'IFileExportService';

export interface IFileExportService {
  exportToExcel(data: any[], filename: string, response: Response): Promise<void>;
  exportToCSV(data: any[], filename: string, response: Response): Promise<void>;
}