import { type DataArray } from "@xenova/transformers";

interface Options {
  model?: string;
  pooling?: "mean";
  normalize?: boolean;
}

const extractorCache: Record<
  string,
  Promise<(text: string, cfg: any) => any>
> = {};

export const generateEmbedding = async (
  content: string,
  options?: Options
): Promise<DataArray> => {
  const { pipeline } = await import("@xenova/transformers");

  const {
    model = "Xenova/all-roberta-large-v1",
    pooling = "mean",
    normalize = true,
  } = options || {};

  if (!extractorCache[model]) {
    extractorCache[model] = pipeline("feature-extraction", model);
  }

  const extractor = await extractorCache[model];

  const tensor = await extractor(content, {
    pooling,
    normalize,
  });

  return tensor.data;
};
