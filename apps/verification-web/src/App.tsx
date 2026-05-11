import React, { useEffect, useState } from 'react';
import { analyze, getHistory, getResult, reset, type UIResult } from './api';

export function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<UIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<UIResult[]>([]);
  const [pending, setPending] = useState(false);

  async function refresh() {
    setHistory(await getHistory(10));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAnalyze() {
    if (!input.trim()) {
      setError('Please enter a claim to analyze.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      const r = await analyze(input);
      setResult(r);
      await refresh();
    } catch (e: any) {
      setError(String(e?.message ?? e));
      setResult(null);
    } finally {
      setPending(false);
    }
  }

  async function loadFromHistory(id: string) {
    try {
      const r = await getResult(id);
      setResult(r);
      setError(null);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  }

  async function onReset() {
    await reset();
    setResult(null);
    setError(null);
    await refresh();
  }

  const confidencePct =
    result && result.confidence != null && Number.isFinite(result.confidence)
      ? `${Math.round(result.confidence * 100)}%`
      : 'n/a';

  return (
    <div className="wrap">
      <header>
        <h1>Content Verification Workbench</h1>
        <p className="tagline">Paste a social-media claim. We&apos;ll classify it.</p>
      </header>

      <section className="input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a social media claim or post..."
          rows={5}
          data-testid="input-textarea"
        />
        <div className="actions">
          <button onClick={onAnalyze} disabled={pending} data-testid="analyze-btn">
            {pending ? 'Analyzing…' : 'Analyze'}
          </button>
          <button onClick={onReset} className="secondary" data-testid="reset-btn">
            Reset
          </button>
        </div>
        {error && (
          <p className="error" data-testid="error-msg">
            {error}
          </p>
        )}
      </section>

      {result && !error && (
        <section className="result" data-testid="result-panel">
          <div className="result-header">
            <span className={`label label-${result.label}`} data-testid="result-label">
              {result.label}
            </span>
            <span className="confidence" data-testid="result-confidence">
              Confidence: {confidencePct}
            </span>
            <code className="result-id" data-testid="result-id">
              {result.id}
            </code>
          </div>
          <p className="claim">
            <strong>Extracted claim:</strong> {result.extractedClaim}
          </p>
          <p data-testid="result-reasoning">
            <strong>Reasoning:</strong> {result.reasoning}
          </p>
          <div>
            <strong>Sources:</strong>
            <ul data-testid="result-sources">
              {(result.sources ?? []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Risk flags:</strong>
            <ul data-testid="result-risk-flags">
              {(result.riskFlags ?? []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="history">
        <h2>Recent analyses</h2>
        {history.length === 0 ? (
          <p className="muted">No analyses yet.</p>
        ) : (
          <ul className="history-list" data-testid="history-list">
            {history.map((h) => (
              <li
                key={h.id}
                onClick={() => loadFromHistory(h.id)}
                data-testid={`history-item-${h.id}`}
              >
                <code>{h.id}</code>{' '}
                <span className={`label-mini label-${h.label}`}>{h.label}</span>{' '}
                <span className="claim-snippet">{h.extractedClaim}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
