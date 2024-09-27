import fs from 'fs/promises';
import path from 'path';
import { IRootObject } from '@/types/legacy';

export async function parseJsonFile(): Promise<IRootObject> {
    const filePath = path.join(process.cwd(), 'public', 'legacy', 'data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData) as IRootObject;
}