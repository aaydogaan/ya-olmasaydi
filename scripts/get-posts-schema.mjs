import fs from 'fs';
import readline from 'readline';

async function main() {
  const stream = fs.createReadStream('./wp-yedek/yaolmasa_wp95.sql', { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let capturing = false;
  for await (const line of rl) {
    if (line.includes("CREATE TABLE `wpwv_posts`")) {
      capturing = true;
    }
    if (capturing) {
      console.log(line);
      if (line.includes("ENGINE=")) break;
    }
  }
}

main().catch(console.error);
