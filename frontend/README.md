# SentiScope - Product Review Sentiment Analyzer

SentiScope is a full-stack machine learning web application that analyzes product reviews and predicts their sentiment as **Positive**, **Negative**, or **Neutral**.

Built using **React.js**, **Flask**, and **Scikit-learn**, the application supports both single-review predictions and bulk CSV sentiment analysis with downloadable reports and interactive visualizations.

---

## Features

* Analyze individual product reviews instantly
* Upload CSV datasets containing thousands of reviews
* Predict sentiments using a Logistic Regression model
* Display confidence scores for predictions
* Download detailed CSV analysis reports
* Interactive dashboard with sentiment visualizations
* Automatic review column detection in uploaded datasets
* Modern responsive user interface

---

## Tech Stack

### Frontend

* React.js
* Axios
* Chart.js
* CSS

### Backend

* Flask
* Flask-CORS
* Pandas
* Joblib

### Machine Learning

* Scikit-learn
* TF-IDF Vectorization
* Logistic Regression
* Naive Bayes
* Linear SVM (model comparison)

---

## Machine Learning Pipeline

1. Load Amazon product review dataset
2. Preprocess review text
3. Convert text into numerical features using TF-IDF
4. Train multiple classification models:

   * Logistic Regression
   * Naive Bayes
   * Linear SVM
5. Evaluate model performance
6. Deploy the best-performing model for predictions

### Model Performance

| Model               | Accuracy |
| ------------------- | -------- |
| Logistic Regression | 85.14%   |
| Naive Bayes         | 80.85%   |
| Linear SVM          | 85.27%   |

**Selected Model:** Logistic Regression

---

## Screenshots

### Single Review Analysis

![single review analysis](<Screenshot 2026-06-11 at 4.31.58 PM.png>)

### Bulk CSV Analysis Dashboard

![csv file analysis](<Screenshot 2026-06-11 at 4.32.52 PM.png>)

### Generated CSV Report

![analysis report](<Screenshot 2026-06-11 at 4.33.23 PM.png>)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/ShanmukaNandini/product-review-sentiment-analyzer.git
cd product-review-sentiment-analyzer
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## CSV Format

The uploaded CSV should contain one of the following columns:

* Review
* review
* Text
* Review Text

Example:

| Review                               |
| ------------------------------------ |
| This product is amazing!             |
| Terrible quality and poor packaging. |

---

## Future Improvements

* Deploy application using Vercel and Render
* Add deep learning models (LSTM/BERT)
* Support additional languages
* User authentication and history tracking

---

## Author

**Shanmuka Nandini**

B.Tech Computer Science Student | Aspiring AI Engineer
