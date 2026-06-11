from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
import io
from flask import send_file
app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return {
        "status": "online",
        "message": "Product Review Sentiment Analyzer API is running!"
    }

# Load trained model and vectorizer
model = joblib.load("model/sentiment_model.pkl")
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")


@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()

        review = data.get('review')

        if not review:
            return jsonify({'error': 'No review provided'}), 400

        review_vector = vectorizer.transform([review])

        prediction = model.predict(review_vector)[0]

        probabilities = model.predict_proba(review_vector)[0]

        confidence = round(max(probabilities) * 100, 2)

        return jsonify({
         'sentiment': prediction,
         'confidence': confidence
        })      

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/analyze-csv', methods=['POST'])
def analyze_csv():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        df = pd.read_csv(file)

        if len(df) > 5000:
            return jsonify({
                'error': 'Please upload a CSV with fewer than 100,000 reviews.'
            }), 400

        # Find review column automatically
        possible_columns = ['Text', 'Review', 'Review Text', 'review']

        review_column = None

        for col in possible_columns:
            if col in df.columns:
                review_column = col
                break

        if review_column is None:
            return jsonify({
                'error': f'No review column found. Available columns: {list(df.columns)}'
            }), 400
        
        reviews = df[review_column].fillna('').astype(str)

        predictions = []
        confidences = []

        batch_size = 1000

        for i in range(0, len(reviews), batch_size):
            batch = reviews.iloc[i:i + batch_size]

            vectors = vectorizer.transform(batch)

            batch_predictions = model.predict(vectors)

            batch_probabilities = model.predict_proba(vectors)

            batch_confidences = batch_probabilities.max(axis=1)

            predictions.extend(batch_predictions)
            confidences.extend(batch_confidences)

        average_confidence = round(
            (sum(confidences) / len(confidences)) * 100, 2
        ) if confidences else 0

        summary = {
          'total_reviews': len(predictions),
          'positive': predictions.count('Positive'),
          'negative': predictions.count('Negative'),
          'neutral': predictions.count('Neutral'),
          'average_confidence': average_confidence
        }
        results_df = pd.DataFrame({
            'Review': reviews,
            'Prediction': predictions,
            'Confidence': [round(conf * 100, 2) for conf in confidences]
        })

        results_df.to_csv("analysis_report.csv", index=False)

        return jsonify({
            'summary': summary,
            'download_ready': True
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/download-report', methods=['GET'])
def download_report():
    try:
        return send_file(
            "analysis_report.csv",
            as_attachment=True,
            download_name="sentiment_analysis_report.csv",
            mimetype="text/csv"
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)