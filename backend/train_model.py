import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

print("Loading dataset...")
# Load dataset
df = pd.read_csv("Reviews.csv")

# Keep only needed columns
df = df[['Score', 'Text']]

# Remove missing reviews
df = df.dropna()
df = df.sample(n=50000, random_state=42)

print("Dataset loaded successfully.")
print(f"Total reviews used: {len(df)}")

# Convert ratings into sentiments
def label_sentiment(score):
    if score >= 4:
        return "Positive"
    elif score in [1,2]:
        return "Negative"
    else:
        return "Neutral"

df['Sentiment'] = df['Score'].apply(label_sentiment)
print("\nSentiment Distribution:")
print(df['Sentiment'].value_counts())

# Features and labels
X = df['Text']
y = df['Sentiment']

# Convert text into numbers
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_features=5000
)

X_vectors = vectorizer.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vectors,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model Accuracy: {accuracy * 100:.2f}%")

import os

os.makedirs("model", exist_ok=True)
print("Saving model...")

# Save model
joblib.dump(model, "model/sentiment_model.pkl")

# Save vectorizer
joblib.dump(vectorizer, "model/tfidf_vectorizer.pkl")

print("Model saved successfully.")