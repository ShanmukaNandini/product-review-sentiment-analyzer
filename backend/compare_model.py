import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC

print("Loading dataset...")

# Load dataset
df = pd.read_csv("Reviews.csv")

# Keep only required columns
df = df[['Score', 'Text']]

# Remove missing values
df = df.dropna()

# Use 50k reviews for faster training
df = df.sample(n=50000, random_state=42)

print(f"Using {len(df)} reviews")

# Convert scores to sentiments
def label_sentiment(score):
    if score >= 4:
        return "Positive"
    elif score <= 2:
        return "Negative"
    else:
        return "Neutral"

df['Sentiment'] = df['Score'].apply(label_sentiment)

# Features and labels
X = df['Text']
y = df['Sentiment']

# TF-IDF Vectorization
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_features=5000
)

X_vectors = vectorizer.fit_transform(X)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X_vectors,
    y,
    test_size=0.2,
    random_state=42
)

# Models to compare
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Naive Bayes": MultinomialNB(),
    "Linear SVM": LinearSVC()
}

results = []

print("\nModel Comparison")
print("=" * 40)

for name, model in models.items():

    print(f"\nTraining {name}...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    results.append((name, accuracy))

    print(f"{name}: {accuracy * 100:.2f}%")

# Display final ranking
print("\nFinal Results")
print("=" * 40)

results.sort(key=lambda x: x[1], reverse=True)

for model_name, accuracy in results:
    print(f"{model_name}: {accuracy * 100:.2f}%")