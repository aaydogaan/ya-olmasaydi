import fs from "fs";
import readline from "readline";
import { parseSqlInsertValues } from "./sql-parser.mjs";

const SQL_FILE = "./wp-yedek/yaolmasa_wp95.sql";

async function main() {
  const fileStream = fs.createReadStream(SQL_FILE, { encoding: "utf8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const comments = [];
  let lineCount = 0;

  const wpPosts = JSON.parse(fs.readFileSync("./src/data/wp-posts.json", "utf8"));
  const postIdToSlug = {};
  for (const p of wpPosts) {
    postIdToSlug[String(p.id)] = p.slug;
  }

  for await (const line of rl) {
    lineCount++;
    if (line.includes("`wpwv_comments`")) {
      console.log("Line with wpwv_comments:", line.slice(0, 80));
    }
    if (line.includes("INSERT INTO `wpwv_comments`")) {
      const idx = line.indexOf("VALUES");
      if (idx !== -1) {
        const valStr = line.slice(idx + 6).trim().replace(/;$/, "");
        const rows = parseSqlInsertValues(valStr);
        console.log("Total parsed rows:", rows.length);
        if (rows.length > 0) {
          console.log("First row:", rows[0]);
        }
        for (const r of rows) {
          // r[0]: id, r[1]: postId, r[2]: author, r[6]: date, r[8]: content, r[10]: approved ('1')
          const isApproved = String(r[10]) === "1" || String(r[10]) === "approve";
          const pId = String(r[1]);
          const slug = postIdToSlug[pId] || null;

          if (isApproved && slug) {
            comments.push({
              id: String(r[0]),
              postId: pId,
              slug,
              author: r[2] || "Ziyaretçi",
              date: r[6],
              content: r[8],
            });
          }
        }
      }
    }
  }

  console.log(`✅ Toplam ${comments.length} onaylanmış WordPress yorumu bulundu ve yazılarla eşleştirildi.`);
  fs.writeFileSync("./src/data/wp-comments.json", JSON.stringify(comments, null, 2));
  console.log("Comments saved to ./src/data/wp-comments.json");
}

main().catch(console.error);
