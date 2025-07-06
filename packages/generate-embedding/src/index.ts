import { fileURLToPath } from "url";
import path from "path";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { pipeline } from "@xenova/transformers";

interface RawGuideline {
  content: string;
  priority: number;
  category: string;
  is_glboal: string;
}

interface Guideline extends RawGuideline {
  embedding: unknown;
}

interface Options {
  model?: string;
  pooling?: "mean";
  normalize?: boolean;
}

export const generateEmbedding = async (
  rawGuideline: RawGuideline,
  options?: Options
): Promise<Guideline> => {
  const {
    model = "Xenova/all-MiniLM-L6-v2",
    pooling = "mean",
    normalize = true,
  } = options || {};

  const extractor = await pipeline("feature-extraction", model);

  const tensor = await extractor(rawGuideline.content, {
    pooling,
    normalize,
  });

  return {
    ...rawGuideline,
    embedding: tensor.data,
  };
};

// const guidelinesSource = readFileSync("./guidelines.json", "utf8");
// const parsedGuidelines = JSON.parse(guidelinesSource) as RawGuideline[];

// const guidelinesWithEmbeddings = await Promise.all(
//   parsedGuidelines.map(async (guideline): Promise<Guideline> => {
//     const tensor = await extractor(guideline.content, {
//       // Token combination method
//       pooling: "mean",
//       // Recommend for semantic searchs
//       normalize: true,
//     });

//     return {
//       ...guideline,
//       embedding: tensor.data,
//     };
//   })
// );

// writeFileSync(outputPath, JSON.stringify(guidelinesWithEmbeddings), {
//   flag: "w",
// });
