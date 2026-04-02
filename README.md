# 🎥 CineMood V2 // Movie Discovery Platform

**Live Link**: https://cinemood-v2.vercel.app/

**CineMood** is a web application designed to solve the problem of *choice paralysis*.
Instead of endlessly scrolling through movie lists, users can discover films based on their current mood and interests using AI.

---

## ⚡ Tech Stack (MERN)

* **Frontend:** React.js & Tailwind CSS for a fast, responsive, and modern UI
* **Backend:** Node.js & Express.js for API logic and server-side handling
* **Database:** MongoDB for storing user profiles, watchlists, and movie data
* **AI Integration:** Gemini AI & TMDB API for intelligent recommendations and movie data

---

## 🧠 Key AI Features

### 1. VibeSearch

VibeSearch is our custom search tool that goes beyond traditional category-based search.

Instead of searching by genres like *Action* or *Comedy*, users can describe how they feel — for example, *“I want a movie that feels like a rainy night in London.”*

**How it works:**
The input is sent to our **Gemini AI service layer**, which analyzes the emotional tone and returns movie matches that fit that exact vibe.

---

### 2. Weekly Spotlight

Weekly Spotlight is a personalized recommendation section that updates every 7 days.

**Calibration:**
This feature stays locked until the user adds **5 movies** to their watchlist.

**How it works:**
Once the engine has enough data, it uses AI to analyze the user’s taste and generates a custom theme along with a movie collection for that week.

---

## 🛠️ Other Functionalities

* **User Authentication:** Secure login and registration
* **Onboarding Flow:** A guided step-by-step setup to calibrate a new user’s profile
* **Smart Watchlist:** A real-time list where users can save movies they want to watch
* **Protected Routes:** Custom route logic to ensure guests, users, and admins only access the pages they are allowed to view

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cinemood.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file and add the following:

```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
TMDB_API_KEY=your_tmdb_api_key
```

### 4. Start the app

```bash
npm run dev
```

---

## 📝 Project Overview

**Submission Date:** April 2, 2026

**Objective:**
To create a streamlined movie discovery experience that uses AI to bridge the gap between user intent and cinematic content, effectively ending the “infinite scroll” problem.

---

**With ❤️, Joyal**

Developer and Artitect CineMood
