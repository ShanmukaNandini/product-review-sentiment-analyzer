# Product Review Sentiment Analyzer

A full-stack sentiment analysis application that classifies product reviews as **Positive**, **Negative**, or **Neutral** using Natural Language Processing (NLP).

## 🚀 Features

- Analyze product reviews in real time
- Classify reviews into:
  - Positive 😃
  - Negative 😞
  - Neutral 😐
- Display sentiment polarity scores
- React-based interactive frontend
- Flask REST API backend
- TextBlob-powered sentiment analysis
- Error handling for invalid inputs and server issues

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML/CSS

### Backend
- Flask
- Flask-CORS

### NLP & Data Processing
- TextBlob
- NLTK

### Version Control
- Git
- GitHub

---

## 📸 Screenshots

### Positive Sentiment Analysis
![Positive Result](screenshots/positive.png)

### Negative Sentiment Analysis
![Negative Result](screenshots/negative.png)

### Neutral Sentiment Analysis
![Neutral Result](screenshots/neutral.png)

---

## 📂 Project Structure

```text
sentimentanalyzer/
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
├── screenshots/
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShanmukaNandini/sentiment-analyzer-.git
cd sentiment-analyzer-
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install flask flask-cors textblob nltk
```

Run the Flask server:

```bash
python app.py
```

The backend will start on:

```
http://127.0.0.1:5000
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will run on:

```
http://localhost:3000
```

---

## 🔄 API Endpoint

### Analyze Review

**POST** `/analyze`

Request Body:

```json
{
    "review": "I love this product!"
}
```

Response:

```json
{
    "review": "I love this product!",
    "polarity": 0.5,
    "sentiment": "Positive 😃"
}
```

---

## 🔮 Future Enhancements

- Upload CSV files containing thousands of reviews
- Batch sentiment analysis for organizations
- Interactive dashboards and visualizations
- Downloadable sentiment analysis reports
- Integration with advanced NLP models such as VADER and BERT

---

## 👩‍💻 Author

**Vallapureddy Shanmuka Nandini**

- GitHub: https://github.com/ShanmukaNandini
- LinkedIn: Add your LinkedIn profile here

---

## 📜 License

This project is open-source and available under the MIT License.
