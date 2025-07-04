import { readFileSync } from "fs"
import { pipeline } from "@xenova/transformers"

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
    pooling: 'mean',
    normalize: true
  })

  return {
    ...guideline,
    embedding: tensor.data
  }
}))

console.log('output', guidelinesWithEmbeddings)