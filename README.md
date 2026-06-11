# 🧠 Product Review Sentiment Analyzer

A full-stack Machine Learning application that analyzes product reviews and predicts sentiment using Natural Language Processing (NLP). The application supports both single review analysis and bulk CSV analysis with interactive visualizations and downloadable reports.

---

## 🚀 Features

* Analyze individual product reviews in real-time.
* Upload CSV datasets for bulk sentiment analysis.
* Confidence score generation for predictions.
* Interactive dashboard with Pie Charts and Bar Charts.
* Downloadable sentiment analysis reports.
* Automatic review column detection in CSV files.
* Comparison of multiple Machine Learning models.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Recharts
* JavaScript
* HTML/CSS

### Backend

* Flask
* Flask-CORS
* Pandas
* Joblib

### Machine Learning

* Scikit-learn
* TF-IDF Vectorization
* Logistic Regression
* Linear SVM
* Naive Bayes

---

## 📊 Dataset

* Amazon Fine Food Reviews Dataset
* 568,454 product reviews
* Reviews collected from October 1999 to October 2012

For model training, a subset of 50,000 reviews was used to optimize training time while maintaining performance.

---

## 🏆 Model Performance

| Model               | Accuracy |
| ------------------- | -------- |
| Linear SVM          | 85.27%   |
| Logistic Regression | 85.14%   |
| Naive Bayes         | 80.85%   |

**Selected Model:** Logistic Regression

Although Linear SVM achieved the highest accuracy, Logistic Regression was selected because it provides probability estimates required for confidence scoring while maintaining comparable performance.

---

## ⚙️ System Architecture

```text
Amazon Reviews Dataset
        ↓
Data Preprocessing
        ↓
TF-IDF Vectorization
        ↓
Logistic Regression Model
        ↓
Flask REST API
        ↓
React Frontend
        ↓
Interactive Dashboard & Reports
```

---

## 📈 Features Implemented

* [x] Single Review Sentiment Analysis
* [x] Bulk CSV Sentiment Analysis
* [x] Confidence Score Prediction
* [x] Interactive Dashboard Visualizations
* [x] Downloadable Analysis Reports
* [x] Machine Learning Model Comparison
* [x] Git Feature Branch Workflow

---

## 📷 Screenshots

### Dashboard

(Add dashboard screenshot here)

### Single Review Prediction

(Add prediction screenshot here)

### Downloadable Analysis Report

(Add report screenshot here)

---

## 💻 Installation

### Clone Repository

```bash
git clone https://github.com/ShanmukaNandini/product-review-sentiment-analyzer.git
cd product-review-sentiment-analyzer
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python train_model.py

python app.py
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## 🎯 Future Enhancements

* Deploy application using Render and Vercel.
* Add dark mode support.
* Implement deep learning models such as LSTM and BERT.
* Add user authentication and history tracking.

---

## 👩‍💻 Author

**Shanmuka Nandini**

Final Year B.Tech Student passionate about Machine Learning, Artificial Intelligence, and Full Stack Development.
