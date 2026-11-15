# Vaani Shudhikaran 

**Vaani Shudhikaran** is a native Indian language processing and purification application. It is designed to take raw inputs in various languages (like English, Hinglish, Marathi, Hindi, etc.) and naturally process, enrich, or "purify" them using AI, presenting the output in an elegant, interactive UI.

This is a **Vibe Coding** project built entirely through **AI orchestration** and autonomous agents pair programming with the user.

## 🎯 Project Goal
The primary goal of Vaani Shudhikaran is **Native Indian language processing and purification**. Modern communication often blends scripts and phonetics (e.g., Hinglish or typed Marathi). This application aims to seamlessly process, correct, and formalize these linguistic blendings, producing pure, high-quality vernacular output efficiently.

## 💻 Tech Stack
This application leverages modern web technologies and specific AI-driven workflows:
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion (for fluid, Zen-like UI animations)
- **AI Backend**: Google Gemini Models (e.g., Gemini 1.5/2.5 Flash) via native API routes
- **Architecture**: **Agentic Architecture** — built through AI orchestration ("Vibe Coding"). The codebase uses agentic tools (`AGENTS.md`) and workflows to self-document, construct boundaries, and handle intelligent fallbacks.

## 🚀 Setup & Installation

Follow these steps to run the application locally:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "Vaani Shudhikaran/project"
   ```

2. **Install dependencies:**
   Ensure you have Node.js and `npm` installed.
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   We have provided an environment template to make setup easy and secure.
   - Copy the `.env.example` file to create your local environment file:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and fill in the required keys, such as `GEMINI_API_KEY`. (Get your key from Google AI Studio).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 🌐 Vercel Deployment
This project is **Build Ready** and optimized for deployment on Vercel. All TypeScript types and unused imports have been cleanly resolved. 

To deploy:
1. Push your code to your GitHub repository.
2. Link the repository to your Vercel account.
3. Add your `GEMINI_API_KEY` to Vercel's environment variables.
4. Deploy!

---
*Built with ❤️ in a Vibe Coding environment.*
