import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const sizes = [16, 32, 48];
const images = sizes.map((s) => {
  const filePath = path.join(publicDir, `favicon-${s}x${s}.png`);
  const data = fs.readFileSync(filePath);
  return { size: s, data };
});

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // ICO type
header.writeUInt16LE(images.length, 4); // count

const dirEntries = Buffer.alloc(16 * images.length);
let currentOffset = 6 + 16 * images.length;

images.forEach((img, idx) => {
  const entryOffset = idx * 16;
  dirEntries.writeUInt8(img.size, entryOffset + 0); // width
  dirEntries.writeUInt8(img.size, entryOffset + 1); // height
  dirEntries.writeUInt8(0, entryOffset + 2); // colors
  dirEntries.writeUInt8(0, entryOffset + 3); // reserved
  dirEntries.writeUInt16LE(1, entryOffset + 4); // planes
  dirEntries.writeUInt16LE(32, entryOffset + 6); // bpp
  dirEntries.writeUInt32LE(img.data.length, entryOffset + 8); // size
  dirEntries.writeUInt32LE(currentOffset, entryOffset + 12); // offset

  currentOffset += img.data.length;
});

const icoBuffer = Buffer.concat([
  header,
  dirEntries,
  ...images.map((img) => img.data),
]);

const outPath = path.join(publicDir, "favicon.ico");
fs.writeFileSync(outPath, icoBuffer);
console.log(`Successfully created genuine multi-resolution favicon.ico (${icoBuffer.length} bytes) at ${outPath}`);
