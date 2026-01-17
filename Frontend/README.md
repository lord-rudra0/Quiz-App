# Quiz App Frontend

The frontend for the Quiz Application, built with **React (Vite)** and **Tailwind CSS**. It connects to the backend API and Supabase for authentication and data.

## 🛠 Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State/Auth**: Supabase Client

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- Backend server running (default: `http://localhost:5000`).
- Supabase project set up.

### Installation

1.  **Navigate to the Frontend directory**:
    ```bash
    cd Frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update the variables in `.env`:
        ```env
        VITE_SUPABASE_URL=your_supabase_project_url
        VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        VITE_API_URL=http://localhost:5000 # Or your deployed backend URL
        ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173` (or similar).

## 📂 Project Structure
- `src/components`: Reusable UI components.
- `src/pages`: Main application pages (Auth, Quiz, etc.).
- `src/contexts`: React Contexts (e.g., AuthContext).
- `src/services`: API service calls.
