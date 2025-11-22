
/**
 * Helper function to remove quotes from a string if present
 */
const unquote = (str: string): string => {
    if (str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1).replace(/\\"/g, '"');
    }
    return str;
}

/**
 * Parses a CSV line considering quoted values
 */
const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuote = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
            current += char; // Keep quotes for unquote function or strip here? 
            // Actually let's strip them in unquote, but we need to keep them in 'current' to detect boundaries if we wanted to be strict,
            // but here we just toggle inQuote.
            // Wait, if I add char to current, unquote handles it.
        } else if (char === ',' && !inQuote) {
            result.push(unquote(current.trim()));
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) {
        result.push(unquote(current.trim()));
    }
    return result;
};

/**
 * Parses TOON format string back to JSON object.
 * 
 * Format assumptions based on promptNodesToToon:
 * - Indentation using spaces (2 spaces per level)
 * - Keys followed by colon
 * - Arrays denoted by key[Count]: item1, item2
 * - Objects denoted by key:\n followed by indented children
 */
export const toonToJson = (toon: string): Record<string, unknown> => {
  const lines = toon.split('\n');
  const root: Record<string, unknown> = {};
  // Stack keeps track of [Object, IndentationLevel]
  // Initial stack has root at level -1 so top level items (indent 0) are added to it
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: root, indent: -1 }];

  // Regex to match:
  // Group 1: Indentation
  // Group 2: Key
  // Group 3: Array Count (optional)
  // Group 4: Value (optional)
  const lineRegex = /^(\s*)(.*?)(?:\[(\d+)\])?:\s*(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; 

    const match = line.match(lineRegex);
    if (!match) {
       // Skip malformed lines or handle as multiline strings (not supported in simple version)
       continue;
    }

    const [, indentStr, key, arrayCount, valueStr] = match;
    const indent = indentStr.length;
    const value = valueStr ? valueStr.trim() : '';

    // Pop stack until we find the parent (whose indent is less than current)
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const currentParent = stack[stack.length - 1].obj;
    const cleanKey = key.trim();

    if (arrayCount) {
        // Array case: key[N]: item1, item2
        const items = parseCsvLine(value);
        currentParent[cleanKey] = items;
    } else {
        if (value === '') {
            // Object case: key:\n (value is empty on this line)
            const newObj = {};
            currentParent[cleanKey] = newObj;
            stack.push({ obj: newObj, indent });
        } else {
            // Simple value case: key: value
            currentParent[cleanKey] = unquote(value);
        }
    }
  }

  return root;
};

