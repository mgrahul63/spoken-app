# SpeakUp 🗣️ — Full-Stack English Learning App

SpeakUp is a structured English learning platform designed to help users move from Beginner to Advanced level through daily lessons, speech practice, quizzes, and real-life conversation training.

The goal is simple: help users actually speak English confidently, not just memorize it.

---
## 🔴 Live Demo

👉 https://spoken-app-low1.vercel.app/


## 🗂️ Project Structure

```
speakup/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── data/
│   │   └── learningData.json ← All lesson content (structured JSON)
│   ├── middleware/
│   │   └── auth.js           ← JWT authentication middleware
│   ├── models/
│   │   ├── User.js           ← User schema
│   │   └── Progress.js       ← Progress tracking schema
│   ├── routes/
│   │   ├── auth.js           ← Register / Login / Profile
│   │   ├── lessons.js        ← Lesson content API
│   │   └── progress.js       ← Progress CRUD
│   ├── .env                  ← Environment variables
│   └── server.js             ← Express entry point
│
└── frontend/                 ← React.js + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── QuoteBar.jsx          ← Rotating motivational quotes
    │   │   ├── Navbar.jsx            ← Top navigation
    │   │   ├── Roadmap.jsx           ← Visual learning roadmap
    │   │   ├── SpeakBtn.jsx          ← TTS pronunciation button
    │   │   └── lesson/
    │   │       ├── ProgressBar.jsx   ← Daily progress tracker
    │   │       ├── VocabSection.jsx  ← Vocabulary + TTS
    │   │       ├── PhrasesSection.jsx← Phrases + hidden Bangla
    │   │       ├── SentencesSection.jsx
    │   │       ├── QuizSection.jsx   ← MCQ Quiz
    │   │       ├── StorySection.jsx  ← Story + comprehension
    │   │       ├── ListeningSection.jsx ← Audio + comprehension
    │   │       ├── SpeakingSection.jsx  ← Mic input + playback
    │   │       └── ConversationSection.jsx ← AI-style Q&A
    │   ├── context/
    │   │   ├── AuthContext.js        ← Auth state management
    │   │   └── ProgressContext.js    ← Progress state management
    │   ├── hooks/
    │   │   └── useSpeech.js         ← TTS + Speech Recognition hooks
    │   ├── pages/
    │   │   ├── AuthPage.jsx         ← Login / Register
    │   │   ├── HomePage.jsx         ← Main dashboard
    │   │   ├── LessonPage.jsx       ← Full lesson with tabs
    │   │   └── DashboardPage.jsx    ← Progress overview
    │   └── App.jsx                  ← Router + Providers
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React.js 18, Tailwind CSS 3   |
| Backend  | Node.js, Express.js           |
| Database | MongoDB Atlas (Mongoose)      |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| Speech   | Web Speech API (TTS + STT)    |
| State    | Context API                   |
| Routing  | React Router v6               |
| HTTP     | Axios                         |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm
- MongoDB URI (already set in .env)

---

### 1. Start the Backend

git clone https://github.com/mgrahul63/spoken-app-backend

```bash
cd backend
npm install
npm run dev
```

Server runs at: **http://localhost:5000**

---

### 2. Start the Frontend

git clone https://github.com/mgrahul63/spoken-app

```bash
cd frontend
npm install
npm start
```

App runs at: **http://localhost:3000**

---

## ✨ Features

### 🔐 Authentication

- Register / Login with JWT
- Password hashed with bcrypt
- Auto-login on page refresh
- Streak tracking on daily login

### 🗺️ Learning Roadmap

- 5 levels: Beginner → Elementary → Intermediate → Upper-Intermediate → Advanced
- Levels unlock progressively
- Visual roadmap with progress indicators

### 📚 Daily Lessons (8 sections each)

1. **📝 Vocabulary** — Word + phonetic + meaning + Bangla (hidden, click to reveal) + example with TTS
2. **💬 Phrases** — Daily & situational phrases with hidden Bangla meaning
3. **✍️ Sentences** — Real-life communication sentences with TTS
4. **🧩 Quiz** — MCQ with instant feedback and explanations
5. **📖 Story** — Short story with TTS and comprehension questions
6. **🎧 Listening** — Audio conversation with script toggle and comprehension
7. **🎤 Speaking** — Mic recording, voice playback, speaking tips
8. **🤝 Conversation** — Interactive Q&A (type or speak), role-play scenarios

### 📊 Progress Tracking

- Section-level progress (each of 8 sections tracked)
- Real-time progress bar
- XP system (+50 XP per completed lesson)
- Level up every 3 lessons
- Full progress dashboard

### 🗣️ Speech Features (Web Speech API)

- Text-to-Speech (TTS) on every word, phrase, sentence, story, listening
- Speech Recognition (mic input) for speaking & conversation practice
- Works natively in Chrome/Edge — no API key needed

---

## 📖 Adding More Content

Edit `backend/data/learningData.json` to add more levels or days:

```json
{
  "levelId": 3,
  "levelName": "Upper-Intermediate",
  "emoji": "📡",
  "days": [
    {
      "day": 1,
      "topic": "Business Communication",
      "lessonId": "L3D1",
      "vocabulary": [...],
      "phrases": [...],
      "sentences": [...],
      "quiz": [...],
      "story": {...},
      "listening": {...},
      "speaking": {...},
      "conversation": {...}
    }
  ]
}
```

---

## 🌐 Browser Support

| Feature      | Chrome | Edge | Firefox    | Safari |
| ------------ | ------ | ---- | ---------- | ------ |
| TTS (speak)  | ✅     | ✅   | ✅         | ✅     |
| Speech Input | ✅     | ✅   | ⚠️ Limited | ❌     |

> **Tip:** Use Chrome for the best speech recognition experience.

## Summary

SpeakUp helps you:

- Think in English
- Speak naturally
- Practice daily
- Build real confidence
