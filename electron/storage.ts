import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// 数据存储路径：桌面/pet-data/
const DATA_DIR = path.join(os.homedir(), 'Desktop', 'pet-data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDataPath(filename: string): string {
  ensureDir();
  return path.join(DATA_DIR, filename);
}

export function readJSON(filename: string, defaultValue: any = {}): any {
  try {
    const p = getDataPath(filename);
    if (!fs.existsSync(p)) return defaultValue;
    const data = fs.readFileSync(p, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

export function writeJSON(filename: string, data: any): void {
  const p = getDataPath(filename);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}
