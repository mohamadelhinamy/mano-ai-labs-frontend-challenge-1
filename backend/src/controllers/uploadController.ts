import { type Context } from 'hono';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { parseAndValidateCSV } from '../services/csvService.js';
import { generateMRFFile } from '../services/mrfFileService.js';

export const uploadFile = async (c: Context) => {
  try {
    const formData = await c.req.parseBody();

    const file = formData['file'];

    if (!(file instanceof File)) {
      return c.json({ error: 'No file uploaded or incorrect file type. Only CSV files are allowed.' }, 400);
    }

    if (file.type !== 'text/csv') {
      return c.json({ error: 'Invalid file type. Only CSV files are allowed.' }, 400);
    }

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const data = await parseAndValidateCSV(fileBuffer);
      return c.json({ message: 'File processed successfully', data });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  } catch (err) {
    return c.json({ error: 'Error parsing form data' }, 400);
  }
};

export const generateMRF = async (c: Context) => {
  try {
    const data = await c.req.json();
    if (!Array.isArray(data.claims) || data.claims.length === 0) {
      return c.json({ message: 'Claims data is required and must be a non-empty array' }, 400);
    }

    generateMRFFile(data.claims);
    return c.json({ message: 'MRF file generated successfully' }, 200);
  } catch (error: any) {
    return c.json({ error: `Failed to generate MRF file: ${error.message}` }, 500);
  }
};

export const listMRFFiles = async (c: Context): Promise<Response> => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const mrfDirPath = path.join(__dirname, '../mrf_files');

    const files = await fs.readdir(mrfDirPath);

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(mrfDirPath, file);
        const stats = await fs.stat(filePath);
        return {
          fileName: file,
          lastModified: stats.mtime.toISOString(),
        };
      })
    );

    return c.json({ files: fileDetails }, 200);
  } catch (error: any) {
    console.error('Error while listing MRF files:', error);
    return c.json({ message: 'Failed to list MRF files', error: error.message }, 500);
  }
};

export const getMRFFile = async (c: Context): Promise<Response> => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const mrfDirPath = path.join(__dirname, '../mrf_files');
    const fileName = c.req.param('file');

    if (!fileName) {
      return c.json({ message: 'File name is required' }, 400);
    }

    const filePath = path.join(mrfDirPath, fileName);

    const fileContent = await fs.readFile(filePath, 'utf-8');

    return c.json({ content: JSON.parse(fileContent) }, 200);
  } catch (error: any) {
    console.error('Error while fetching MRF file:', error);
    return c.json({ message: 'Failed to fetch MRF file', error: error.message }, 500);
  }
};