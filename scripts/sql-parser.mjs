import fs from 'fs';
import readline from 'readline';

/**
 * Robust MySQL Dump Value Parser
 * Reads an INSERT INTO `table` VALUES (...) line and yields row arrays.
 */
export function parseSqlInsertValues(valuesString) {
  const rows = [];
  let i = 0;
  const len = valuesString.length;

  while (i < len) {
    // Find start of tuple '('
    while (i < len && valuesString[i] !== '(') i++;
    if (i >= len) break;
    i++; // skip '('

    const currentRow = [];
    let currentField = '';
    let inString = false;
    let isNull = false;

    while (i < len) {
      const char = valuesString[i];

      if (inString) {
        if (char === '\\') {
          // escaped character
          if (i + 1 < len) {
            const next = valuesString[i + 1];
            if (next === 'n') currentField += '\n';
            else if (next === 'r') currentField += '\r';
            else if (next === 't') currentField += '\t';
            else if (next === "'") currentField += "'";
            else if (next === '"') currentField += '"';
            else if (next === '\\') currentField += '\\';
            else currentField += next;
            i += 2;
            continue;
          }
        } else if (char === "'") {
          // Check for escaped quote ''
          if (i + 1 < len && valuesString[i + 1] === "'") {
            currentField += "'";
            i += 2;
            continue;
          } else {
            inString = false;
            i++;
            continue;
          }
        }
        currentField += char;
        i++;
      } else {
        if (char === "'") {
          inString = true;
          i++;
        } else if (char === ',' || char === ')') {
          const trimmed = currentField.trim();
          if (trimmed.toUpperCase() === 'NULL') {
            currentRow.push(null);
          } else if (!isNaN(trimmed) && trimmed !== '') {
            // Keep large IDs or numeric values
            currentRow.push(trimmed);
          } else {
            currentRow.push(currentField);
          }
          currentField = '';

          if (char === ')') {
            i++; // skip ')'
            rows.push(currentRow);
            break;
          } else {
            i++; // skip ','
          }
        } else {
          currentField += char;
          i++;
        }
      }
    }
  }
  return rows;
}
