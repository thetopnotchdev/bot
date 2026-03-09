import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '..', 'config.json');

const raw = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(raw);

// Override with environment variables if provided
if (process.env.DISCORD_TOKEN) {
  config.token = process.env.DISCORD_TOKEN;
}
if (process.env.DISCORD_CLIENT_ID) {
  config.clientId = process.env.DISCORD_CLIENT_ID;
}

export default config;

