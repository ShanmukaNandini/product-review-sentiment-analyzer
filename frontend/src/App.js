import React, { useState } from 'react';
import './App.css';

function App() {
  // These are 'state' variables. They remember what the user types and what the backend replies.
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);

  // This function runs when the button is clicked
  const analyzeReview = async () => {

  // Check if the user entered anything
  if (!review.trim()) {
    alert("Please enter a review!");
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
    alert("Unable to connect to the server. Please make sure Flask is running.");
  }
};

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Product Review Sentiment Analyzer</h1>
      <p>Enter a product review below to see if it is positive, negative, or neutral.</p>
      
      {/* The Text Box */}
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
          <p><strong>Mathematical Polarity Score:</strong> {result.polarity} <br/> 
          <small>(-1 is negative, 0 is neutral, 1 is positive)</small></p>
        </div>
      )}
    </div>
  );
}

export default App;