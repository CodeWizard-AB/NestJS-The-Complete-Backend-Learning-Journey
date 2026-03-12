import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly config: Record<string, any> = {};

  constructor(@Inject('CONFIG_OPTIONS') private options: any) {
    this.loadConfig();
  }

  private loadConfig() {
    const configPath = path.join(process.cwd(), this.options.envFilePath);
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      content.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          this.config[key.trim()] = value.trim();
        }
      });
    }
  }

  get(key: string): string {
    return this.config[key] || process.env[key] || '';
  }

  getNumber(key: string): number {
    return parseInt(this.get(key)) || 0;
  }

  getBoolean(key: string): boolean {
    return this.get(key) === 'true';
  }
}
