# Next.js + FastAPI Full-Stack Chat Template

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-8A2BE2?style=for-the-badge)

A modern, production-ready template for building full-stack AI chat applications. This repository provides a seamless integration between a Next.js frontend and a FastAPI backend, featuring real-time, token-by-token streaming responses from a LangChain-powered language model.

---

### ✨ Live Demo

![App Demo mp4](demo/chat-demo.mp4)

---

## 🚀 Features

*   **Modern Frontend:** Built with **Next.js 14 (App Router)** and styled with **Material-UI** for a clean, professional, and responsive user interface.
*   **High-Performance Backend:** Powered by **FastAPI**, providing a robust and fast API for handling chat logic.
*   **Real-Time Streaming:** Implements **Server-Sent Events (SSE)** to stream AI responses token-by-token, creating an engaging, real-time user experience.
*   **AI-Powered Chat:** Integrates with **LangChain** and Google's Gemini models to provide intelligent, conversational responses.
*   **Clean Architecture:** Decoupled frontend and backend for better maintainability and scalability.
*   **Simple & Extensible:** A minimal, unopinionated foundation perfect for building more complex AI applications, including those with authentication, databases, and more advanced LangGraph agents.

## 🛠️ Tech Stack

*   **Frontend:**
    *   Framework: **Next.js**
    *   UI: **Material-UI**
    *   API Client: **Axios**
    *   Streaming: **`@microsoft/fetch-event-source`**
*   **Backend:**
    *   Framework: **FastAPI**
    *   AI Orchestration: **LangChain**
    *   Language Model: **Google Gemini** (easily swappable)
    *   Environment Management: **`python-dotenv`**

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v18 or later)
*   Python (v3.9 or later)
*   A Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nextjs-fastapi-integration-template.git
cd nextjs-fastapi-integration-template
```

### 2. Backend Setup

First, set up and run the FastAPI server.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate
# On Windows, use: venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# Create a .env file from the example
cp .env.example .env 
# (Or create .env manually)

# Add your Google Gemini API key to the .env file
# GOOGLE_API_KEY="your-google-gemini-api-key-here"

# Run the backend server
uvicorn main:app --reload
```
The backend server will now be running on `http://localhost:8000`.

### 3. Frontend Setup

In a **new terminal**, set up and run the Next.js frontend.

```bash
# Navigate to the frontend directory
cd frontend

# Install the required dependencies
npm install

# Run the frontend development server
npm run dev
```
The frontend will now be running on `http://localhost:3000`.

### 4. Use the App!

Open your browser and navigate to `http://localhost:3000`. You can now start chatting with the AI.

---

## 📂 Project Structure

```
.
├── backend/
│   ├── .env              # Environment variables (API keys)
│   ├── main.py           # Single-file FastAPI app with chat logic
│   └── requirements.txt  # Python dependencies
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.js   # Root layout with ThemeProvider
    │   │   └── page.js     # The main chat page component
    │   ├── components/
    │   │   └── ThemeRegistry.js # Material-UI setup for Next.js
    │   └── lib/
    │       └── api.js      # Axios instance (not used in simple version)
    └── package.json
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
