import fs from 'fs/promises';
import path from 'path';
import { IRootObject } from '@/types/legacy';

export async function parseJsonFile(): Promise<IRootObject> {
  const filePath = process.env.LEGACY_DATA_PATH || path.join(process.cwd(), 'src', 'data', 'legacy-data.json');    const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData) as IRootObject;
}