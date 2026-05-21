const EMBEDDING_DIMENSIONS = 1536;

function hashToken(token: string): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic local embedding when OPENAI_API_KEY is not set (dev/demo). */
export function embedTextLocal(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  const tokens = text
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  for (const token of tokens) {
    const h = hashToken(token);
    const index = h % EMBEDDING_DIMENSIONS;
    const sign = h % 2 === 0 ? 1 : -1;
    vector[index] += sign * (1 + (h % 7) / 7);
  }

  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

export async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return embedTextLocal(text);
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
      input: text.slice(0, 8000),
    }),
  });

  if (!response.ok) {
    return embedTextLocal(text);
  }

  const json = (await response.json()) as {
    data?: { embedding: number[] }[];
  };

  const embedding = json.data?.[0]?.embedding;
  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    return embedTextLocal(text);
  }

  return embedding;
}

export function embeddingToPgVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}

export const EMBEDDING_DIM = EMBEDDING_DIMENSIONS;
