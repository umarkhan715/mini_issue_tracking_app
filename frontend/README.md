# Mini Issue Tracking App – Frontend

## Stack
- Next.js (App Router, TypeScript)
- Ant Design (UI components)
- React 19
- State: LocalStorage (for auth)
- Data fetching: REST API to backend
- Node >20


## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```
Example:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 3. Run the development server
```bash
npm run dev
```

### 5. Open the app
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

For backend setup, see the `/backend` folder and its README.
