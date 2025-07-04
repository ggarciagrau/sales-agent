import { fileURLToPath } from "url";
import path from "path";
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { pipeline } from "@xenova/transformers"

const filePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(filePath);

const outputDir = path.resolve(currentDir, '../../static/artifacts')
const outputPath = path.join(outputDir, 'guideline-embeddings.json')
mkdirSync(outputDir, { recursive: true })

interface RawGuideline { 
  content: string,
  priority: number,
  category: string,
  is_glboal: string
}

interface Guideline extends RawGuideline {
  embedding: unknown
}

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

const guidelinesSource = readFileSync('./guidelines.json', 'utf8')
const parsedGuidelines = JSON.parse(guidelinesSource) as RawGuideline[]

const guidelinesWithEmbeddings = await Promise.all(parsedGuidelines.map(async (guideline): Promise<Guideline> => {
  const tensor = await extractor(guideline.content, {
    // Token combination method
    pooling: 'mean',
    // Recommend for semantic searchs
    normalize: true
  })

  return {
    ...guideline,
    embedding: tensor.data
  }
}))

writeFileSync(outputPath, JSON.stringify(guidelinesWithEmbeddings), {
  flag: 'w' 
})