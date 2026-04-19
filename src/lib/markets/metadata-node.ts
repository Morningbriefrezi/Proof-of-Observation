import * as fs from "fs";
import * as path from "path";

const BINDINGS_FILE = path.resolve(
  process.cwd(),
  "src",
  "data",
  "market-id-bindings.json",
);

function readBindings(): Record<string, number> {
  try {
    const raw = fs.readFileSync(BINDINGS_FILE, "utf8");
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

function writeBindings(bindings: Record<string, number>): void {
  fs.mkdirSync(path.dirname(BINDINGS_FILE), { recursive: true });
  fs.writeFileSync(BINDINGS_FILE, JSON.stringify(bindings, null, 2) + "\n");
}

export function bindMarketIdToSlug(slug: string, marketId: number): void {
  const bindings = readBindings();
  bindings[slug] = marketId;
  writeBindings(bindings);
}

export function readBindingsFromDisk(): Record<string, number> {
  return readBindings();
}
