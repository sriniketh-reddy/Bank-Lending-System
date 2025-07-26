# Quick Start Guide: Bank Lending System

## Features
- Responsive React.js frontend with Material-UI
- Node.js/Express.js backend API
- SQLite database
- Modern, mobile-friendly navigation bar

## Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sriniketh-reddy/Bank-Lending-System.git
   cd bank-lending-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Deployment on Render.com

### Backend (Node.js/Express)
1. Push your code to GitHub.
2. Go to [Render.com](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repo and select the backend folder as the root.
4. Set build command: `npm install && npm run init-db`
5. Set start command: `npm start`
6. Set environment: Node 16+ (or your version)
7. Add environment variable: `NODE_ENV=production`

### Frontend (React)
1. Go to Render.com and create a new **Static Site**.
2. Connect your GitHub repo and select the `frontend` folder as the root.
3. Set build command: `npm install && npm run build`
4. Set publish directory: `build`

### API URLs in Production
- Update your frontend API URLs to point to your backend Render URL (e.g., `https://your-backend.onrender.com/api/v1/...`).
- You can do this with an environment variable or by editing your axios/fetch base URL.

## Database Management
- **Initialize database**: `npm run init-db`
- **Reset database**: `npm run reset-db`

## Scripts
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies
- `npm run init-db` - Initialize database
- `npm run reset-db` - Clear all database records

## Project Structure
```
bank-lending-system/
├── backend/
│   ├── routes/
│   ├── scripts/
│   ├── database/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.js
│   └── public/
├── package.json
└── README.md
```

## UI/UX
- Responsive navigation bar (drawer on mobile)
- Clean, card-based layout
- Consistent color scheme

## License
MIT License 
