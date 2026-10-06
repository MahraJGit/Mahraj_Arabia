import { readFileSync } from "node:fs";

export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (!match) continue;
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
    } catch {
      // optional env file
    }
  }
}
