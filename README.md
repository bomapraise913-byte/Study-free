# 📚 StudyFree — AI Study Website

A professional AI-powered study website with flashcards, quizzes and notes.
Supports PDF upload, photo of notes, YouTube links and text input.

---

## 🚀 How to Deploy (Free on Render.com)

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Click **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

### Step 2 — Upload to GitHub
1. Create a free account at https://github.com
2. Create a new repository called `studyfree`
3. Upload ALL these files to it

### Step 3 — Deploy on Render (free hosting)
1. Go to https://render.com and sign up free
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Fill in these settings:
   - **Name**: studyfree
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Environment** tab → Add variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (paste your API key)
6. Click **Create Web Service**
7. Wait 2–3 minutes — your website is live! 🎉

---

## 📁 File Structure

```
studyfree/
├── server.js          ← Backend server (handles API & PDF)
├── package.json       ← Dependencies
├── .env.example       ← Environment template
├── .gitignore
└── public/
    ├── index.html     ← Main website
    ├── style.css      ← All styles
    └── app.js         ← All frontend logic
```

---

## ✅ Features

- 🃏 **Flashcards** — flip cards with key terms and answers
- 🧠 **Quiz** — multiple choice, true/false, short answer with scoring
- 📝 **Notes** — structured, bullet or detailed study notes
- 📄 **PDF upload** — text extracted automatically on the server
- 🖼 **Photo of notes** — AI reads handwriting and printed text
- ▶️ **YouTube** — generate content from video topics
- ✏️ **Paste text** — direct text input
- 📋 Copy & 🖨 Print notes
- ⌨️ Keyboard navigation for flashcards (← → Space)
- 📱 Fully mobile responsive
