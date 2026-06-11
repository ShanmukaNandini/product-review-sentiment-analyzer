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
        review_vectors = vectorizer.transform(reviews)

        predictions = model.predict(review_vectors)

        # Calculate confidence scores
        probabilities = model.predict_proba(review_vectors)

        confidences = probabilities.max(axis=1)

        average_confidence = round(confidences.mean() * 100, 2)

        summary = {
          'total_reviews': len(predictions),
          'positive': int((predictions == 'Positive').sum()),
          'negative': int((predictions == 'Negative').sum()),
          'neutral': int((predictions == 'Neutral').sum()),
          'average_confidence': average_confidence
        }
        results_df = pd.DataFrame({
            'Review': reviews,
            'Prediction': predictions,
            'Confidence': (confidences * 100).round(2)
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