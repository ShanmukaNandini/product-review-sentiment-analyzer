import React, { useState, useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import './App.css';

const API_BASE = 'https://product-review-sentiment-analyzer.onrender.com';

const SENTIMENT_CONFIG = {
  Positive: { color: '#1D9E75', bg: '#E1F5EE', icon: '😄', label: 'Positive' },
  Negative: { color: '#E24B4A', bg: '#FCEBEB', icon: '😞', label: 'Negative' },
  Neutral:  { color: '#BA7517', bg: '#FAEEDA', icon: '😐', label: 'Neutral'  },
};

const CHART_COLORS = ['#1D9E75', '#E24B4A', '#BA7517'];

function ConfidenceBar({ value }) {
  const color = value >= 75 ? '#1D9E75' : value >= 50 ? '#BA7517' : '#E24B4A';
  return (
    <div className="confidence-bar-wrap">
      <div className="confidence-bar-track">
        <div className="confidence-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="confidence-label" style={{ color }}>{value}%</span>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-value" style={{ color }}>{value.toLocaleString()}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function SentimentCharts({ summary }) {
  const data = [
    { name: 'Positive', value: summary.positive },
    { name: 'Negative', value: summary.negative },
    { name: 'Neutral',  value: summary.neutral  },
  ];
  const pct = (n) => ((n / summary.total_reviews) * 100).toFixed(1) + '%';

  return (
    <div className="charts-section">
      <h2 className="section-title">Visual Breakdown</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={90} innerRadius={50} paddingAngle={3} label={({ name }) => name}>
                {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Reviews']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Review counts</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Reviews']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pct-row">
        {data.map((d, i) => (
          <div key={d.name} className="pct-chip" style={{ background: CHART_COLORS[i] + '18', color: CHART_COLORS[i], border: `1px solid ${CHART_COLORS[i]}40` }}>
            <strong>{pct(d.value)}</strong> {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [review, setReview]     = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [file, setFile]         = useState(null);
  const [summary, setSummary]   = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef();

  const handleTextChange = (e) => {
    setReview(e.target.value);
    setCharCount(e.target.value.length);
  };

  const analyzeReview = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setResult(data);
    } catch (err) {
      alert('Could not connect to Flask server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (f) => {
    if (f && f.name.endsWith('.csv')) setFile(f);
    else alert('Please upload a CSV file.');
  };

  const analyzeCSV = async () => {
    if (!file) return;
    setCsvLoading(true);
    setSummary(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res  = await fetch(`${API_BASE}/analyze-csv`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setSummary(data.summary);
    } catch (err) {
      alert(err.message || 'CSV analysis failed.');
    } finally {
      setCsvLoading(false);
    }
  };

  const clearFile = () => { setFile(null); setSummary(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const clearReview = () => { setReview(''); setResult(null); setCharCount(0); };

  const cfg = result ? (SENTIMENT_CONFIG[result.sentiment] || SENTIMENT_CONFIG['Neutral']) : null;

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <rect width="32" height="32" rx="8" fill="#534AB7"/>
                <path d="M8 22c2-4 4-7 8-7s6 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="11" cy="13" r="2" fill="#fff"/>
                <circle cx="21" cy="13" r="2" fill="#fff"/>
              </svg>
            </div>
            <div>
              <h1 className="brand-name">SentiScope</h1>
              <p className="brand-sub">Product Review Sentiment Analyzer</p>
            </div>
          </div>
          <div className="header-badge">Powered by ML · Logistic Regression</div>
        </div>
      </header>

      <main className="app-main">
        {/* ── Single Review Section ── */}
        <section className="card">
          <div className="card-header">
            <div className="section-icon teal">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <h2 className="card-title">Analyze a Review</h2>
              <p className="card-desc">Paste any product review to instantly detect its sentiment.</p>
            </div>
          </div>

          <div className="textarea-wrap">
            <textarea
              className="review-textarea"
              rows={5}
              placeholder="e.g. This product completely exceeded my expectations — fast shipping and excellent quality!"
              value={review}
              onChange={handleTextChange}
              onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') analyzeReview(); }}
            />
            <div className="textarea-footer">
              <span className="char-count">{charCount} characters</span>
              <span className="hint">Ctrl + Enter to analyze</span>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={analyzeReview} disabled={loading || !review.trim()}>
              {loading ? <><span className="spinner" />Analyzing…</> : <>🔍 Analyze Sentiment</>}
            </button>
            {review && <button className="btn btn-ghost" onClick={clearReview}>Clear</button>}
          </div>

          {result && cfg && (
            <div className="result-card" style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}40` }}>
              <div className="result-header">
                <span className="result-emoji">{cfg.icon}</span>
                <div>
                  <p className="result-label">Sentiment detected</p>
                  <h3 className="result-sentiment" style={{ color: cfg.color }}>{result.sentiment}</h3>
                </div>
              </div>
              <div className="result-confidence">
                <p className="confidence-title">Model confidence</p>
                <ConfidenceBar value={result.confidence} />
              </div>
              <p className="result-note">Predicted using Logistic Regression trained on 50,000 Amazon product reviews.</p>
            </div>
          )}
        </section>

        {/* ── CSV Bulk Analysis ── */}
        <section className="card">
          <div className="card-header">
            <div className="section-icon purple">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <h2 className="card-title">Bulk CSV Analysis</h2>
              <p className="card-desc">Upload a dataset to analyze hundreds or thousands of reviews at once.</p>
            </div>
          </div>

          <div
            className={`drop-zone ${dragOver ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
          >
            <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e.target.files[0])} />
            {file ? (
              <div className="file-selected">
                <span className="file-icon">📄</span>
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button className="remove-file" onClick={(e) => { e.stopPropagation(); clearFile(); }} aria-label="Remove file">✕</button>
              </div>
            ) : (
              <div className="drop-prompt">
                <span className="drop-icon">☁️</span>
                <p className="drop-main">Drop your CSV here or <span className="link-text">browse</span></p>
                <p className="drop-sub">Needs a column named: Review, Text, review, or Comment</p>
              </div>
            )}
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={analyzeCSV} disabled={!file || csvLoading}>
              {csvLoading ? <><span className="spinner" />Processing…</> : <>📊 Analyze Dataset</>}
            </button>
            {summary && (
              <button className="btn btn-success" onClick={() => window.open(`${API_BASE}/download-report`, '_blank')}>
                ⬇️ Download Report
              </button>
            )}
          </div>

          {summary && (
            <div className="summary-grid">
              <StatCard label="Total Reviews"   value={summary.total_reviews}    color="#534AB7" icon="📋" />
              <StatCard label="Positive"         value={summary.positive}         color="#1D9E75" icon="😄" />
              <StatCard label="Negative"         value={summary.negative}         color="#E24B4A" icon="😞" />
              <StatCard label="Neutral"          value={summary.neutral}          color="#BA7517" icon="😐" />
              {summary.average_confidence != null && (
                <StatCard label="Avg Confidence" value={`${summary.average_confidence}%`} color="#185FA5" icon="🎯" />
              )}
            </div>
          )}

          {summary && <SentimentCharts summary={summary} />}
        </section>
      </main>

      <footer className="app-footer">
        <p>SentiScope · Built with React + Flask · Logistic Regression · TF-IDF</p>
      </footer>
    </div>
  );
}