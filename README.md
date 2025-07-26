# Bank Lending System

A comprehensive loan management solution with a modern, responsive React frontend and Node.js backend API.

## Features

- **Loan Creation**: Create new loans with principal, interest rate, and period
- **Payment Processing**: Record EMI and lump sum payments
- **Ledger Viewing**: View complete transaction history for any loan
- **Customer Overview**: Get summary of all loans for a customer
- **Real-time Calculations**: Automatic EMI recalculation after lump sum payments
- **Payment Validation**: Prevent overpayments and ensure exact EMI amounts
- **Responsive Design**: Fully responsive layout and navigation bar for mobile and desktop
- **Modern UI**: Clean, card-based layout with Material-UI

## Technology Stack

- **Frontend**: React.js with Material-UI (MUI)
- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **API**: RESTful API with proper error handling

## Quick Start

### Prerequisites
- Node.js (>= 16.0.0)
- npm (>= 8.0.0)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bank-lending-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Initialize database**
   ```bash
   npm run init-db
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Loan Management
- `POST /api/v1/loans` - Create a new loan
- `POST /api/v1/loans/:loanId/payments` - Record a payment
- `GET /api/v1/loans/:loanId/ledger` - View loan ledger

### Customer Management
- `GET /api/v1/customers/:customerId/overview` - View customer overview

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

## Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies
- `npm run init-db` - Initialize database with sample data
- `npm run reset-db` - Clear all database records

## Project Structure

```
bank-lending-system/
├── backend/
│   ├── routes/
│   │   ├── loans.js
│   │   └── customers.js
│   ├── scripts/
│   │   ├── init-database.js
│   │   └── reset-database.js
│   ├── database/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreateLoan.js
│   │   │   ├── MakePayment.js
│   │   │   ├── ViewLedger.js
│   │   │   └── CustomerOverview.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   └── App.js
│   └── public/
├── package.json
└── README.md
```

## License
MIT License - see LICENSE file for details. 