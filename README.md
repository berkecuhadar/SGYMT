# Simple Gym Tracker (SGYMT) 🏋️

**Simple Gym Tracker (SGYMT)** is a lightweight, dark-themed fitness tracking application built with **React**, **Bootstrap**, and **Firebase**.

The app helps athletes track workouts, monitor body measurements, maintain gym consistency through daily check-ins, and discover other fitness profiles.

---

## 🚀 Features

### 🔐 User Authentication
- Secure authentication with Firebase
- Persistent login sessions
- Stay signed in across visits

### ✅ Daily Gym Check-In
- One-click gym attendance tracking
- Helps maintain workout consistency

### 🏋️ Workout Logger
- Add exercises dynamically
- Expand sets infinitely
- Track:
  - Sets
  - Reps
  - Weight

### 📈 Progress Tracking
Log and monitor body metrics over time:

- Weight
- Height
- Arm size
- Chest size
- Calf size

### 👥 Social Discovery
- Search for registered users
- View shared public fitness profiles
- Accessible through public profile routes

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js v16+**
- **npm v8+**

Check installed versions:

```bash
node -v
npm -v
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

You can duplicate `.env.example` and update it with your Firebase credentials.

Example configuration:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=1:YOUR_MESSAGING_SENDER_ID:web:YOUR_UNIQUE_APP_ID
```

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available in your local browser.

---

## 📂 Project Purpose

SGYMT was designed as a **simple and efficient fitness tracking system** focused on:

- Workout logging
- Body measurement tracking
- Daily consistency monitoring
- Lightweight performance
- Clean dark-themed UI

---

## 📄 License

This project is open-source and licensed under the **MIT License**.