import fs from 'fs';
import readline from 'readline';

async function main() {
  const stream = fs.createReadStream('./wp-yedek/yaolmasa_wp95.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum >= 3770 && lineNum <= 3850) {
      console.log(`${lineNum}: ${line.substring(0, 80)}`);
    }
  }
}

main().catch(console.error);
