# Lottie Animation Management System

A fullstack offline-first application for managing Lottie animations, built with React.js, Node.js, Express.js, SQLite, and JWT authentication.

## Features

- 🔐 JWT-based authentication
- 📦 Offline-first support via Service Workers
- 🎨 Upload and preview Lottie JSON animations
- 🔍 Search animations by title, description, or tags
- 👤 User profiles with private/public animations
- 📱 Responsive design

## Tech Stack

### Frontend
- React.js with TypeScript
- React Router for navigation
- React Query for data fetching
- Lottie React for animation previews
- Vite PWA plugin for service workers
- Axios for API calls

### Backend
- Node.js with Express.js
- TypeScript
- SQLite database
- JWT authentication
- Multer for file uploads
- Bcrypt for password hashing

## Project Structure

```
animation-manager/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. Seed the database with test data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## Test Users

After running the seed script, you can use these test accounts:

1. **john_doe**
   - Email: `john@example.com`
   - Password: `password123`

2. **jane_smith**
   - Email: `jane@example.com`
   - Password: `password123`

3. **animator_pro**
   - Email: `animator@example.com`
   - Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Animations
- `GET /api/animations` - Get all accessible animations (requires auth)
- `GET /api/animations/public` - Get public animations (no auth)
- `GET /api/animations/my-animations` - Get user's animations (requires auth)
- `GET /api/animations/:id` - Get animation by ID (requires auth)
- `GET /api/animations/search/:query` - Search animations (requires auth)
- `POST /api/animations` - Upload new animation (requires auth)
- `PUT /api/animations/:id` - Update animation (requires auth, owner only)
- `DELETE /api/animations/:id` - Delete animation (requires auth, owner only)

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `created_at` - Timestamp

### Animations Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Animation title
- `description` - Animation description
- `filename` - Original filename
- `file_path` - Path to uploaded file
- `file_size` - File size in bytes
- `tags` - Comma-separated tags
- `is_public` - Boolean (0 or 1)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Service Worker

The application includes a service worker for offline support. The service worker:
- Caches static assets
- Caches API responses
- Provides offline functionality
- Automatically updates when new versions are available

## Development

### Building for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## License

ISC





