import { type DataArray } from "@xenova/transformers";

interface Options {
  model?: string;
  pooling?: "mean";
  normalize?: boolean;
}

export const generateEmbedding = async (
  content: string,
  options?: Options
): Promise<DataArray> => {
  const { pipeline } = await import("@xenova/transformers");

  const {
    model = "Xenova/all-MiniLM-L6-v2",
    pooling = "mean",
    normalize = true,
  } = options || {};

  const extractor = await pipeline("feature-extraction", model);

  const tensor = await extractor(content, {
    pooling,
    normalize,
  });

  return tensor.data
};
