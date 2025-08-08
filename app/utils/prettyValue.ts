// Utility to pretty print mixed values (string | array | object | primitive)
// - Arrays of primitives become comma-separated
// - Arrays / objects of objects become JSON with indentation
// - JSON-looking strings are parsed & pretty printed when possible
// - Long single-line strings are left as-is
export function prettyValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "bigint") return value.toString();

  if (typeof value === "string") {
    const trimmed = value.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return JSON.stringify(parsed, replacer, 2);
      } catch {
        return value;
      }
    }
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const allPrimitive = value.every(v => v === null || ["string", "number", "boolean", "bigint"].includes(typeof v));
    if (allPrimitive) return value.map(v => prettyValue(v)).join(", ");
    return JSON.stringify(value, replacer, 2);
  }

  if (typeof value === "object") {
    try {
      // value is a generic object; JSON.stringify will handle plain objects & arrays already filtered
      return JSON.stringify(value, replacer, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function replacer(_key: string, val: unknown) {
  if (typeof val === 'bigint') return val.toString();
  if (val === undefined) return null;
  return val;
}
