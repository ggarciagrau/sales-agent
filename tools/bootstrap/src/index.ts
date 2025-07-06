import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { readFileSync, mkdirSync } from "fs";
import { PrismaDB } from "@sales-agent/db-connector";
import { generateEmbedding } from "@sales-agent/generate-embedding";
import { RawGuideline, Guideline } from "@sales-agent/types";

const filePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(filePath);

// EXPORT FILE
const exportDir = path.resolve(currentDir, "../../../static/artifacts");

const generateEmbeddings = async (): Promise<Guideline[]> => {
  mkdirSync(exportDir, { recursive: true });
  const source = path.resolve(
    currentDir,
    "../../../static/imports/guidelines.json"
  );
  const sourceFile = readFileSync(source, "utf-8");
  const sourceContents = JSON.parse(sourceFile) as RawGuideline[];

  return await Promise.all(
    sourceContents.map(async (guideline) => ({...guideline, embedding: await generateEmbedding(guideline.content)}))
  );
};

const db = new PrismaDB();

const insertEmbedding = async (guideline: any) => {
  await db.$executeRawUnsafe(
    `
  INSERT INTO guidelines (id, title, content, category, priority, active, is_global, embedding, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    $1, $2, $3, $4, true, $5, $6, now(), now()
  )
`,
    guideline.content,
    guideline.content,
    guideline.category,
    guideline.priority,
    guideline.is_global,
    Object.values(guideline.embedding)
  );
};

const waitForDatabaseReady = async (maxRetries = 15, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`⏳ Waiting for DB... Attempt ${attempt}/${maxRetries}`);
      const db = new PrismaDB();
      await db.$connect();
      await db.$disconnect();
      console.log("✅ Database is ready!\n");
      return;
    } catch (err) {
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("❌ Timed out waiting for the database to be ready");
}

console.log(
  "\n🚀 \x1b[1m\x1b[36m=======================================\x1b[0m"
);
console.log("🚀 \x1b[1m\x1b[36m    BOOTSTRAPPING SALES AGENT\x1b[0m");
console.log(
  "🚀 \x1b[1m\x1b[36m=======================================\x1b[0m\n"
);

console.log("🐳 \x1b[1m\x1b[33mStarting Docker Compose...\x1b[0m");
try {
  execSync("docker compose up -d", { stdio: "inherit" });
  console.log("✅ \x1b[1m\x1b[32mDocker Compose started successfully\x1b[0m\n");
} catch (error) {
  console.error(
    "❌ \x1b[1m\x1b[31mError starting Docker Compose:\x1b[0m",
    error
  );
}

await waitForDatabaseReady()

console.log("🗄️  \x1b[1m\x1b[33mRunning database migration...\x1b[0m");
try {
  execSync("pnpm -F db-connector db:migrate", { stdio: "inherit" });
  console.log(
    "✅ \x1b[1m\x1b[32mDatabase migration completed successfully\x1b[0m\n"
  );
} catch (error) {
  console.error(
    "❌ \x1b[1m\x1b[31mError running database migration:\x1b[0m",
    error
  );
}

console.log("🧠 \x1b[1m\x1b[33mGenerating embeddings...\x1b[0m");
try {
  const preparedGuidelines = await generateEmbeddings();
  console.log("✅ \x1b[1m\x1b[32mEmbeddings generated successfully\x1b[0m");

  console.log("💾 \x1b[1m\x1b[33mInserting embeddings into database...\x1b[0m");
  await Promise.all(preparedGuidelines.map(insertEmbedding));
  console.log("✅ \x1b[1m\x1b[32mEmbeddings inserted successfully\x1b[0m");

  console.log(
    "\n🎉 \x1b[1m\x1b[35m=======================================\x1b[0m"
  );
  console.log("🎉 \x1b[1m\x1b[35m    BOOTSTRAP COMPLETED SUCCESSFULLY!\x1b[0m");
  console.log(
    "🎉 \x1b[1m\x1b[35m=======================================\x1b[0m\n"
  );
} catch (error) {
  console.error("❌ \x1b[1m\x1b[31mError with embeddings:\x1b[0m", error);
}
