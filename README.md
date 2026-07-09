# 🇯🇵 Kakkoi Nihongo — JLPT N5 Learning Platform
### Full Project Roadmap (Frontend + Backend + Features)

**Founder:** NAKUL  **Co-Founder:** NIKHIL

---

## 1. Project Overview

**Kakkoi Nihongo** is a web platform dedicated to helping learners master **JLPT N5** — the entry level of the Japanese Language Proficiency Test. The site combines structured lessons, practice tools, and a lightweight account system so users can save and share their progress.

**Core promise:** Everything a beginner needs for N5, in one clean, dark/light-mode-friendly site.

---

## 2. Tech Stack

### Frontend
| Layer | Tech |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (CSS variables for theming, Flexbox/Grid) |
| Behavior | Vanilla JavaScript (or React later if the project scales) |
| Icons | Lucide / Font Awesome |
| Fonts | Noto Sans JP (Japanese text) + Poppins/Inter (UI text) |

### Backend (pick one — all viable, listed by ease of shipping fast)
| Option | Best if... |
|---|---|
| **Node.js + Express** ✅ Recommended | You want JS end-to-end, fastest to prototype, huge ecosystem |
| **Python + Flask/FastAPI** | You want quick API + easy data/quiz logic scripting |
| **PHP (native or Laravel)** | You want cheap shared hosting, simple deployment |
| **Java (Spring Boot)** | You want strict structure, scalability, resume-building with enterprise stack |

> Roadmap below is written stack-agnostic, but code examples in the next build phase will default to **Node.js + Express + MySQL/MongoDB** unless you tell me otherwise.

### Database
| Data | Suggested DB |
|---|---|
| Users, progress, scores | MySQL / PostgreSQL (relational, simple schema) or MongoDB (flexible JSON progress) |

### Auth
- **No email required.** Simple **username + password** signup/login.
- Passwords hashed with **bcrypt** (never stored in plain text).
- Session handled via **JWT** or server-side sessions (cookie).

### Hosting (when ready)
- Frontend: Vercel / Netlify / GitHub Pages (if static)
- Backend: Render / Railway / Fly.io / VPS
- DB: Railway/PlanetScale (MySQL) or MongoDB Atlas

---

## 3. Site Map (Pages)

```
/                     → Landing page (hero, why N5, CTA to start)
/roadmap              → Visual N5 study roadmap (this doc, turned interactive)
/hiragana              → Hiragana chart + stroke order + audio
/katakana               → Katakana chart + stroke order + audio
/kanji                 → N5 Kanji list (80 kanji) with readings + examples
/vocabulary            → N5 vocabulary list (~800 words), searchable, filterable
/grammar                → N5 grammar points with examples & explanations
/quizzes                → Practice quizzes (kana, vocab, kanji, grammar)
/flashcards             → Flashcard practice mode (spaced repetition style)
/listening              → Listening practice clips + transcripts
/progress               → User's personal dashboard (only if logged in)
/profile/:username      → Public shareable progress page
/login                  → Username + password login
/signup                 → Username + password signup
/about                  → About Kakkoi Nihongo, Founder & Co-Founder section
```

---

## 4. Core Features Checklist

### 📘 Learning Content
- [ ] Hiragana chart (46 base + dakuten/handakuten + combo sounds) with audio playback
- [ ] Katakana chart (same structure)
- [ ] Stroke order animations/images for kana
- [ ] N5 Kanji list (~80 kanji): meaning, onyomi, kunyomi, stroke count, example words
- [ ] N5 Vocabulary list (~800 words): word, reading, meaning, example sentence
- [ ] N5 Grammar points (~120 points): structure, meaning, example sentences, usage notes
- [ ] Listening practice: short audio clips + transcripts + comprehension questions

### 🎮 Practice & Retention
- [ ] Flashcard mode with flip animation
- [ ] Spaced repetition logic (basic: track correct/incorrect, resurface weak cards)
- [ ] Quiz mode: multiple choice, fill-in-the-blank, matching
- [ ] Timed challenge mode (optional, gamification)
- [ ] Progress bar per section (Hiragana / Katakana / Kanji / Vocabulary / Grammar)

### 👤 User Accounts (No Email)
- [ ] Signup: username + password only
- [ ] Login: username + password
- [ ] Password hashing (bcrypt)
- [ ] Save progress to account (per-section completion %, quiz scores, streak)
- [ ] Editable public profile: display name, avatar, bio, "studying since" date
- [ ] Shareable profile link (`kakkoinihongo.com/profile/username`) showing progress publicly
- [ ] Social share buttons (copy link, share to X/Twitter, WhatsApp)

### 🎨 UI/UX
- [ ] Dark mode + Light mode toggle (persisted via localStorage, synced to DB if logged in)
- [ ] Responsive design (mobile-first)
- [ ] Smooth transitions between theme switch
- [ ] Japanese-inspired minimal aesthetic (red/white/ink-black accents, or your brand palette)

### 🏢 Branding / About Section
- [ ] Footer / About page with Founder & Co-Founder cards
- [ ] Instagram button linking to **NAKUL**'s Instagram (Founder)
- [ ] Instagram button linking to **NIKHIL**'s Instagram (Co-Founder)

---

## 5. Database Schema (Draft)

```
users
------
id            INT (PK, auto increment)
username      VARCHAR(30) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
display_name  VARCHAR(50)
avatar_url    VARCHAR(255)
bio           TEXT
theme_pref    ENUM('light','dark') DEFAULT 'light'
created_at    TIMESTAMP

progress
------
id            INT (PK)
user_id       INT (FK -> users.id)
section       ENUM('hiragana','katakana','kanji','vocabulary','grammar','listening')
completed_pct FLOAT DEFAULT 0
last_updated  TIMESTAMP

quiz_scores
------
id            INT (PK)
user_id       INT (FK -> users.id)
quiz_type     VARCHAR(50)
score         INT
total         INT
taken_at      TIMESTAMP

flashcard_state
------
id            INT (PK)
user_id       INT (FK -> users.id)
card_id       VARCHAR(50)
correct_count INT DEFAULT 0
wrong_count   INT DEFAULT 0
next_review   TIMESTAMP
```

---

## 6. API Endpoints (Draft, REST style)

```
POST   /api/auth/signup         { username, password }
POST   /api/auth/login          { username, password }
POST   /api/auth/logout

GET    /api/user/me             → current logged-in user data
PUT    /api/user/me              → update display_name, bio, avatar, theme_pref
GET    /api/user/:username       → public profile data (for sharing)

GET    /api/content/hiragana
GET    /api/content/katakana
GET    /api/content/kanji
GET    /api/content/vocabulary
GET    /api/content/grammar
GET    /api/content/listening

GET    /api/progress             → logged-in user's progress across sections
POST   /api/progress             { section, completed_pct }

POST   /api/quiz/submit          { quiz_type, score, total }
GET    /api/quiz/history

GET    /api/flashcards/due       → cards due for review
POST   /api/flashcards/review    { card_id, correct: true/false }
```

---

## 7. Visual Theming (Dark / Light Mode via CSS Variables)

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f7;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --accent: #bc002d;      /* Japan flag red */
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #f5f5f5;
  --text-secondary: #b3b3b3;
  --accent: #ff4d6d;
  --border: #333333;
}
```
Toggle via a JS function that sets `document.documentElement.setAttribute('data-theme', 'dark' | 'light')` and saves the choice to `localStorage` (and to the user's DB record if logged in).

---

## 8. Development Phases (Suggested 6-Week Plan)

**Phase 1 — Foundation (Week 1)**
- Set up repo, folder structure, base HTML/CSS/JS skeleton
- Build landing page + navbar + footer with dark/light toggle
- Add Founder/Co-Founder Instagram buttons in footer/about section

**Phase 2 — Content Core (Week 2)**
- Build Hiragana & Katakana pages with charts + audio
- Structure N5 vocabulary and kanji data (JSON files)
- Build Vocabulary and Kanji browsing pages with search/filter

**Phase 3 — Grammar & Listening (Week 3)**
- Build Grammar page with example sentence toggles
- Add Listening practice section with audio player + transcript reveal

**Phase 4 — Accounts & Backend (Week 4)**
- Set up backend server + database
- Build signup/login (username + password, bcrypt hashing)
- Connect progress-tracking API to frontend

**Phase 5 — Practice Tools (Week 5)**
- Build Flashcard mode with spaced repetition logic
- Build Quiz mode (multiple types) + score saving
- Build personal Progress Dashboard

**Phase 6 — Social & Polish (Week 6)**
- Build public shareable profile pages
- Add share buttons (copy link / social share)
- Final responsive/UI polish, cross-browser testing, deploy

---

## 9. Folder Structure (Suggested)

```
kakkoi-nihongo/
├── frontend/
│   ├── index.html
│   ├── pages/
│   │   ├── hiragana.html
│   │   ├── katakana.html
│   │   ├── kanji.html
│   │   ├── vocabulary.html
│   │   ├── grammar.html
│   │   ├── quizzes.html
│   │   ├── flashcards.html
│   │   ├── listening.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── profile.html
│   │   └── about.html
│   ├── css/
│   │   ├── style.css
│   │   └── theme.css
│   ├── js/
│   │   ├── theme-toggle.js
│   │   ├── auth.js
│   │   ├── flashcards.js
│   │   ├── quiz.js
│   │   └── api.js
│   ├── data/
│   │   ├── hiragana.json
│   │   ├── katakana.json
│   │   ├── kanji.json
│   │   ├── vocabulary.json
│   │   └── grammar.json
│   └── assets/
│       ├── audio/
│       └── images/
├── backend/
│   ├── server.js (or app.py / index.php / Application.java)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
└── README.md
```

---

## 10. About Section Content (Draft Copy)

> **Kakkoi Nihongo** was founded to make learning Japanese for the JLPT N5 exam simple, structured, and genuinely enjoyable — no fluff, just what you need to pass and actually understand the language.

**Founder — NAKUL**
[ Instagram button → links to NAKUL's Instagram ]

**Co-Founder — NIKHIL**
[ Instagram button → links to NIKHIL's Instagram ]

---

## 11. Next Steps

This roadmap covers the full plan. When you're ready, I can start building the actual site — I'd suggest starting with:
1. The landing page + dark/light mode toggle (HTML/CSS/JS)
2. The Hiragana/Katakana pages with real N5 data
3. The signup/login backend (tell me which backend language you want: Node.js, Python, PHP, or Java)

Just tell me which piece to build first and I'll start writing the actual code.
