# Quiz App Backend API

This is the backend API for the Quiz Application, built with **Express (Node.js)** and **Supabase**.

## 🛠 Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend Framework**: Express.js (Node.js)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (JWT),Google Auth
- **Security**: Row Level Security (RLS) + Server-side JWT Verification

## 🗄️ Database
We use **Supabase (PostgreSQL)** because it provides:
- Built-in Authentication and User Management.
- Row Level Security (RLS) for granular data access control.
- PostgreSQL's robustness and reliability.
- easy-to-use JS client.
-Easy to implement Google Auth.

### Schema Structure

#### `quiz_questions`
Global pool of quiz questions.
- `id` (uuid, PK)
- `question_text` (text)
- `choices` (jsonb array of strings)
- `correct_choice` (int, 0-index of correct answer)
- `owner_id` (uuid, NULL for global questions)

#### `quiz_attempts`
Tracks a user's quiz session.
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `started_at` (timestamptz)
- `finished_at` (timestamptz)
- `score` (int)

#### `quiz_answers`
Stores specific answers for an attempt.
- `id` (uuid, PK)
- `attempt_id` (uuid, FK to quiz_attempts)
- `question_id` (uuid, FK to quiz_questions)
- `selected_choice` (int)
- `is_correct` (boolean)

## 🔐 Authentication & JWT Validation
Authentication is handled by **Supabase Auth**.
1.  **Frontend**: User logs in and receives a JWT (`access_token`).
2.  **Backend**: The token is sent in the `Authorization: Bearer <token>` header.
3.  **Validation**:
    - The backend uses `supabase.auth.getUser(token)` to validate the JWT against Supabase's Auth API.
    - This ensures that the token is not only valid in signature but also that the user exists and has not been revoked.
    - This ensures we never trust client-side user IDs and always strictly scope data access.

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed.
- A Supabase project with the schema set up.

### Steps
  
### Clone the repo  
https://github.com/lord-rudra0/Quiz-App
#### Backend
1.  **Navigate to Backend**:
    ```bash
    cd Backend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Fill in your Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`).
    *Note: `SUPABASE_JWT_SECRET` is found in Project Settings > API > JWT Settings.*

4.  **Start the Server**:
    ```bash
    npm start
    # Server runs on port 5000 by default
    ```

#### Frontend
1.  **Navigate to Frontend** (in a new terminal):
    ```bash
    cd ../Frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

## 📡 API Examples

You need a valid JWT token to access these endpoints.

### 1. Get Quiz Questions
Fetches 5 random questions for the user.
```http
GET /api/quiz
Authorization: Bearer <your_jwt_token>
```
**Response:**
```json
[
  {
    "id": "uuid-1",
    "question_text": "What is 2+2?",
    "choices": ["3", "4", "5", "6"]
  },
  ...
]
```

### 2. Submit Quiz
Submits answers and calculates score server-side.
```http
POST /api/quiz/submit
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "answers": [
    { "question_id": "uuid-1", "selected_choice": 1 },
    { "question_id": "uuid-2", "selected_choice": 0 },
    ...
  ]
}
```

### 3. Get History
Returns all past attempts.
```http
GET /api/quiz/results
Authorization: Bearer <your_jwt_token>
```

## 📝 Assumptions & Notes
- **Database Schema**: The `quiz_questions` table uses a `choices` JSONB array column instead of individual `option_a`, `option_b`, etc., columns. This allows for flexible option counts (though currently fixed at 4).
- **Authentication**: We prioritize security by validating tokens directly with Supabase (`getUser`) on every request. This ensures strictly up-to-date user sessions.
- **Frontend URL**: The backend assumes CORS access from `http://localhost:5173` (Vite default). Update `server.js` cors options for production.
