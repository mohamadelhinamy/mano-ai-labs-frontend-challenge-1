import Papa from 'papaparse';
import { validateRowSchema } from '../utils/validation.js';
import { type RowData } from '../types/index.js';

const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => 
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '');
};

export const parseAndValidateCSV = async (fileBuffer: Buffer): Promise<RowData[]> => {
  const fileContent = fileBuffer.toString();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, any>>(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          return reject(new Error('The CSV file is empty or improperly formatted.'));
        }

        const filteredData = results.data.filter((row) => {
          return Object.values(row).some((value) => value !== null && value !== undefined && value !== '');
        });

        const normalizedData = filteredData.map((row) => {
          const newRow: any = {};
          for (const key in row) {
            if (row.hasOwnProperty(key)) {
              newRow[toCamelCase(key)] = row[key];
            }
          }
          return newRow as RowData;
        });

        const corruptedRows : number[] = []

        const errors = normalizedData
          .map((row, index) => {
            try {
              validateRowSchema(row);
            } catch (error: any) {
              corruptedRows.push(index)
              return `Row ${index + 1}: ${error.message}`;
            }
          })
          .filter((error) => error);

        if (errors.length) {
          reject(new Error(errors.join('\n')));
        } else {
          resolve(normalizedData);
        }
      },
      error: (error: any) => reject(error),
    });
  });
};
