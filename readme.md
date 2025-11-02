# Mini Issue Tracking App

A full-stack mini issue tracker with authentication, issue CRUD, and assignment features.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Frontend:** Next.js (App Router), TypeScript, Ant Design, React 19

## Project Structure
```
Mini Issue Tracking App/
├── backend/           # Express API server
├── frontend/          # Next.js web app
└── README.md         # Instructions
```

## Backend Setup

1. **Navigate to backend folder:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend folder:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mini_issue_tracking_app"
   JWT_SECRET="supersecretkey"
   FRONTEND_URL="http://localhost:3000"
   NODE_ENV=development
   PORT=3001
   ```

4. **Set up PostgreSQL database:**
   - Make sure PostgreSQL is running locally
   - Create database `mini_issue_tracking_app`
   - Update password in DATABASE_URL

5. **Run Prisma migrations:**
   ```sh
   npx prisma migrate dev --name init_schema
   npx prisma generate
   ```

6. **Start the backend server:**
   ```sh
   npm run dev
   ```
   Backend will run on `http://localhost:3001`

## Frontend Setup

1. **Navigate to frontend folder:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the frontend folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login a user

### Issues
- `POST /api/issues` — Create an issue
- `GET /api/issues` — List issues (with optional filters: ?status=OPEN&priority=HIGH)
- `GET /api/issues/:id` — Get issue details
- `PATCH /api/issues/:id` — Update issue (status, assignee, description)
- `DELETE /api/issues/:id` — Delete issue
- `GET /api/issues/summary` — Get issue statistics

## Features
- Simple email-based authentication
- Create, read, update, delete issues
- Filter issues by status and priority
- Assign issues to team members
- Issue priority levels (Low, Medium, High)
- Issue status tracking (Open, In Progress, Resolved)
- Dashboard with issue statistics

## Development Notes
- Backend uses layered architecture: Routes → Controllers → Services → Repositories
- Frontend uses localStorage for authentication state
- Database schema managed with Prisma migrations
- Both apps use TypeScript for type safety

---

**Production Deployment:**
- Update environment variables for production
- Deploy backend to Railway/Render and frontend to Vercel