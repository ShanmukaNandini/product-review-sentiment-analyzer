# 🌟 SentiScope - Product Review Sentiment Analyzer

SentiScope is a full-stack Machine Learning web application that analyzes product reviews and classifies them as **Positive**, **Negative**, or **Neutral** using **Logistic Regression** and **TF-IDF Vectorization**. The application supports both **single review sentiment prediction** and **bulk CSV sentiment analysis** with downloadable reports.

## 🚀 Live Demo

* **Frontend (Vercel):** https://product-review-sentiment-analyzer.vercel.app
* **Backend API (Render):** https://product-review-sentiment-analyzer.onrender.com

---

## 📸 Screenshots

### Single Review Analysis

*Add a screenshot here*

### Bulk CSV Analysis Dashboard

*Add a screenshot here*

### Sentiment Distribution Charts

*Add a screenshot here*

---

## ✨ Features

* 🔍 Real-time sentiment analysis for individual product reviews
* 📊 Bulk CSV sentiment analysis (supports up to 5,000 reviews)
* 📈 Interactive visualizations using Pie Charts and Bar Charts
* 📥 Downloadable CSV sentiment reports
* 🎯 Confidence score for each prediction
* ☁️ Fully deployed frontend and backend applications
* 🎨 Modern and responsive user interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Recharts
* CSS3

### Backend

* Flask
* Flask-CORS
* Pandas

### Machine Learning

* Scikit-learn
* Logistic Regression
* TF-IDF Vectorization
* Joblib

### Deployment

* Vercel (Frontend)
* Render (Backend)

### Version Control

* Git
* GitHub

---

## 🧠 Machine Learning Pipeline

1. Collected Amazon product reviews dataset.
2. Performed data preprocessing and cleaning.
3. Converted review text into numerical features using **TF-IDF Vectorization**.
4. Trained a **Logistic Regression** classifier.
5. Saved the trained model using **Joblib**.
6. Integrated the model into a Flask REST API.

---

## 📂 Project Structure

```
product-review-sentiment-analyzer/
│
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── model/
│   │   ├── sentiment_model.pkl
│   │   └── tfidf_vectorizer.pkl
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Clone the repository

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

```
http://127.0.0.1:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📊 Bulk CSV Analysis

The application supports CSV files containing review columns such as:

* `Text`
* `Review`
* `Review Text`
* `review`

For optimal performance on the deployed version, uploads are limited to **5,000 reviews**.

---

## 🎯 Future Improvements

* Support for larger datasets using chunk-based processing
* Background task processing with Celery and Redis
* Deep Learning models (LSTM/BERT)
* User authentication and history tracking
* Docker containerization

---

## 👩‍💻 Author

**Shanmuka Nandini**

* GitHub: https://github.com/ShanmukaNandini
* LinkedIn: linkedin.com/in/shanmuka-vallapureddy

---

⭐ If you found this project useful, please consider giving it a star!
