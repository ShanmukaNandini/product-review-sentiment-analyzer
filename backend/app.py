from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import nltk

# Download NLTK data required for text processing
nltk.download('punkt')
nltk.download('punkt_tab')

# Initialize the Flask app
app = Flask(__name__)
# Enable CORS so our React frontend can communicate with this backend safely
CORS(app) 

# Create an API route called '/analyze' that accepts POST requests
@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    # 1. Get the data sent from React
    data = request.get_json()
    review = data.get('review', '')

    # 2. Safety check: if the review is empty, return an error
    if not review:
        return jsonify({'error': 'No review provided'}), 400

    # 3. NLP Magic: Pass the text into TextBlob
    blob = TextBlob(review)
    
    # Polarity is a score from -1.0 (very negative) to 1.0 (very positive)
    polarity = blob.sentiment.polarity

    # 4. Classify the score into categories
    if polarity > 0.1:
        sentiment = 'Positive 😃'
    elif polarity < -0.1:
        sentiment = 'Negative 😞'
    else:
        sentiment = 'Neutral 😐'

    # 5. Send the result back to React in JSON format
    return jsonify({
        'review': review,
        'polarity': round(polarity, 2),
        'sentiment': sentiment
    })

# Start the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)