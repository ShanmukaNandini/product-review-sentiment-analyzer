from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import nltk
import pandas as pd

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


@app.route('/analyze-csv', methods=['POST'])
def analyze_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    try:
        df = pd.read_csv(file)

        # Flexible column detection — handles 'review', 'Review Text', 'text', etc.
        review_col = None
        for col in df.columns:
            if col.strip().lower() in ['review', 'review text', 'reviews', 'text', 'comment', 'feedback']:
                review_col = col
                break

        if review_col is None:
            return jsonify({
                'error': f"No review column found. Columns in your CSV: {list(df.columns)}"
            }), 400

        sentiments = []
        polarities = []

        # Use the detected column name instead of hardcoded 'review'
        for review in df[review_col]:
            blob = TextBlob(str(review))
            polarity = blob.sentiment.polarity

            if polarity > 0.1:
                sentiment = 'Positive'
            elif polarity < -0.1:
                sentiment = 'Negative'
            else:
                sentiment = 'Neutral'

            sentiments.append(sentiment)
            polarities.append(round(polarity, 2))

        df['Sentiment'] = sentiments
        df['Polarity'] = polarities

        summary = {
            'total_reviews': len(df),
            'positive': sentiments.count('Positive'),
            'negative': sentiments.count('Negative'),
            'neutral': sentiments.count('Neutral')
        }

        # Only return the summary — not all rows.
        # Sending 23,000+ records crashes the browser's JSON parser.
        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Start the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)