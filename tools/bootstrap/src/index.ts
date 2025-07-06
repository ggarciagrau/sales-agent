import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { readFileSync, mkdirSync } from "fs";
import { PrismaDB } from "db-connector";
import { generateEmbedding } from "@sales-agent/generate-embedding";

interface RawGuideline {
  content: string;
  priority: number;
  category: string;
  is_glboal: string;
}

interface Guideline extends RawGuideline {
  embedding: unknown;
}

const filePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(filePath);

// EXPORT FILE
const exportDir = path.resolve(currentDir, "../../../static/artifacts");
const generateEmbeddings = async (): Promise<Guideline[]> => {
  mkdirSync(exportDir, { recursive: true });
  const source = path.resolve(currentDir, "../../../static/imports/guidelines.json")
  const sourceFile = readFileSync(source, 'utf-8')
  const sourceContents = JSON.parse(sourceFile) as RawGuideline[]

  return await Promise.all(sourceContents.map(guideline => generateEmbedding(guideline)))
}

// IMPORT FILE;
// const inputDir = path.resolve(currentDir, "../../../static/artifacts");
// const input = path.join(inputDir, "guideline-embeddings.json");
// const rawGuidelines = readFileSync(input, "utf-8");
// const parsedGuidelines = JSON.parse(rawGuidelines);

const db = new PrismaDB();
// const res = await db.$queryRawUnsafe(`SELECT inet_server_addr(), inet_server_port();`);
// console.log('Res: ', res)

// const dbName = await db.$queryRawUnsafe(`SELECT current_database()`);
// console.log('Database:', dbName[0].current_database);

// const schema = await db.$queryRawUnsafe(`SELECT current_schema()`);
// console.log('Schema:', schema[0].current_schema);

// const publicTables = await db.$queryRawUnsafe(`
//   SELECT table_name
//   FROM information_schema.tables
//   WHERE table_schema = 'public';
// `);

// console.table(publicTables);

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

console.log('\n🚀 \x1b[1m\x1b[36m=======================================\x1b[0m')
console.log('🚀 \x1b[1m\x1b[36m    BOOTSTRAPPING SALES AGENT\x1b[0m')
console.log('🚀 \x1b[1m\x1b[36m=======================================\x1b[0m\n')

console.log('🐳 \x1b[1m\x1b[33mStarting Docker Compose...\x1b[0m')
try {
  execSync('docker compose up -d', { stdio: 'inherit' })
  console.log('✅ \x1b[1m\x1b[32mDocker Compose started successfully\x1b[0m\n')
} catch (error) {
  console.error('❌ \x1b[1m\x1b[31mError starting Docker Compose:\x1b[0m', error)
}

console.log('🗄️  \x1b[1m\x1b[33mRunning database migration...\x1b[0m')
try {
  execSync('pnpm -F db-connector db:migrate', { stdio: 'inherit' })
  console.log('✅ \x1b[1m\x1b[32mDatabase migration completed successfully\x1b[0m\n')
} catch (error) {
  console.error('❌ \x1b[1m\x1b[31mError running database migration:\x1b[0m', error)
}

console.log('🧠 \x1b[1m\x1b[33mGenerating embeddings...\x1b[0m')
try {
  const preparedGuidelines = await generateEmbeddings()
  console.log('✅ \x1b[1m\x1b[32mEmbeddings generated successfully\x1b[0m')
  
  console.log('💾 \x1b[1m\x1b[33mInserting embeddings into database...\x1b[0m')
  await Promise.all(preparedGuidelines.map(insertEmbedding))
  console.log('✅ \x1b[1m\x1b[32mEmbeddings inserted successfully\x1b[0m')
  
  console.log('\n🎉 \x1b[1m\x1b[35m=======================================\x1b[0m')
  console.log('🎉 \x1b[1m\x1b[35m    BOOTSTRAP COMPLETED SUCCESSFULLY!\x1b[0m')
  console.log('🎉 \x1b[1m\x1b[35m=======================================\x1b[0m\n')
} catch (error) {
  console.error('❌ \x1b[1m\x1b[31mError with embeddings:\x1b[0m', error)
}