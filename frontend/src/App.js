import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import './App.css';
const COLORS = ['#28a745', '#dc3545', '#fd7e14'];

function SentimentCharts({ summary }) {
  const data = [
    { name: 'Positive', value: summary.positive },
    { name: 'Negative', value: summary.negative },
    { name: 'Neutral', value: summary.neutral },
  ];

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Sentiment Analysis Dashboard</h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}
      >
        {/* Pie Chart */}
        <div
          style={{
            width: '450px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <h3>Sentiment Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div
          style={{
            width: '450px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <h3>Review Counts</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function App() {
  // These are 'state' variables. They remember what the user types and what the backend replies.
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const downloadReport = () => {
    window.open(
      'http://127.0.0.1:5000/download-report',
      '_blank'
    );
  };
  // This function runs when the button is clicked
  const analyzeReview = async () => {
    // Check if the user entered anything
    if (!review.trim()) {
      alert('Please enter a review!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review }),
      });

      const data = await response.json();

      // Check if Flask returned an error
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      // Show a friendly message to the user
      alert('Unable to connect to the server. Please make sure Flask is running.');
    }
  };

  const analyzeCSV = async () => {
    if (!file) {
      alert('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      alert('CSV analysis failed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Product Review Sentiment Analyzer</h1>
      <p>Enter a product review below to see if it is positive, negative, or neutral.</p>

      {/* The Text Box */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />
      <button
        onClick={analyzeCSV}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        Analyze CSV Dataset
      </button>
      <br /><br />
      <textarea
        rows="5"
        cols="50"
        placeholder="e.g., I absolutely love this product! It works great."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        style={{ padding: '10px', fontSize: '16px' }}
      />

      <br /><br />

      {/* The Button */}
      <button
        onClick={analyzeReview}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Analyze Sentiment
      </button>

      {/* The Result Display (Only shows if there is a result) */}
      {result && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', display: 'inline-block', borderRadius: '10px' }}>
          <h2>Result: {result.sentiment}</h2>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          <p style={{ color: '#666' }}>
            Prediction generated using Logistic Regression.
          </p>
        </div>
      )}
      {summary && (

        <>
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              display: 'inline-block',
            }}
          >
            <h2>Dataset Summary</h2>

            <p>Total Reviews: {summary.total_reviews}</p>
            <p>Positive Reviews: {summary.positive}</p>
            <p>Negative Reviews: {summary.negative}</p>
            <p>Neutral Reviews: {summary.neutral}</p>
            <p>Average Confidence: {summary.average_confidence}%</p>
            <br />

            <button
              onClick={downloadReport}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Download Analysis Report
            </button>
          </div>

          <SentimentCharts summary={summary} />
        </>
      )}
    </div>
  );
}

export default App;