const base = '/api';

export interface UIResult {
  id: string;
  input: string;
  extractedClaim: string;
  label: 'true' | 'false' | 'unverified';
  confidence: number | null;
  reasoning: string;
  sources: string[];
  riskFlags?: string[];
  risk_flags?: string[];
  category: string;
  createdAt: string;
}

export async function analyze(input: string): Promise<UIResult> {
  const r = await fetch(`${base}/analyze`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error ?? `analyze failed: ${r.status}`);
  }
  return r.json();
}

export async function getHistory(limit = 10): Promise<UIResult[]> {
  const r = await fetch(`${base}/history?limit=${limit}`);
  return r.json();
}

export async function getResult(id: string): Promise<UIResult> {
  const r = await fetch(`${base}/result/${id}`);
  if (!r.ok) throw new Error('not found');
  return r.json();
}

export async function reset(): Promise<void> {
  await fetch(`${base}/reset`, { method: 'POST' });
}
