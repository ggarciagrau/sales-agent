export interface RawGuideline {
  content: string;
  priority: number;
  category: string;
  is_glboal: string;
}

export interface Guideline extends RawGuideline {
  embedding: unknown;
}