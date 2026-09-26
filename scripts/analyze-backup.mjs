import fs from 'fs';
import readline from 'readline';

async function main() {
  const filePath = './wp-yedek/yaolmasa_wp95.sql';
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let foundPostsDump = false;
  let linesAfter = 0;

  for await (const line of rl) {
    if (line.includes("Dumping data for table `wpwv_posts`")) {
      foundPostsDump = true;
      console.log("FOUND DUMP HEADER!");
      continue;
    }
    if (foundPostsDump && linesAfter < 10) {
      console.log(`Line ${linesAfter}:`, line.substring(0, 150));
      linesAfter++;
      if (linesAfter >= 10) break;
    }
  }
}

main().catch(console.error);
