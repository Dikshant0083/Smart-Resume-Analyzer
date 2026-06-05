# ResumeIQ - Smart Resume Analyzer

AI-powered resume analysis and job matching platform.

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + ShadcnUI
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt

## Getting Started

```bash
# Install all dependencies
npm run install-all

# Run development servers
npm run dev
```

## Environment Variables

Create `.env` files in both `client/` and `server/` directories.

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumeiq
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```