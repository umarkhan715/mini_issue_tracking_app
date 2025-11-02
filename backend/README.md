# Mini Issue Tracking App

A full-stack mini issue tracker with authentication, issue CRUD, and assignment features.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL

## Backend Setup
1. Clone the repository and navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your PostgreSQL database and update `.env` with your credentials.
4. Run Prisma migrations and generate client:
   ```sh
   npx prisma migrate dev --name init_schema
   npx prisma generate
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login (or auto-register) a user
- `POST /api/issues` — Create an issue
- `GET /api/issues` — List issues (with filters)
- `GET /api/issues/:id` — Get issue details
- `PATCH /api/issues/:id` — Update issue
- `DELETE /api/issues/:id` — Delete issue
- `GET /api/issues/summary` — Get issue stats

## Frontend Setup (to be added)
- Will use Next.js and Ant Design for UI

---

**Note:**
- Make sure PostgreSQL is running locally and accessible.
- For production, update environment variables and security settings.
