# Payment Account Sharing Platform

A full-stack payment platform built with React 19.2, Node.js, Express.js, TypeScript, Prisma ORM, and Tailwind CSS. The platform enables provider-merchant collaborations, payment processing via Stripe and PayPal, payout management, and dispute handling.

## 🏗️ Project Structure

This is a monorepo containing two main applications:

```
payment-platform/
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── middleware/           # Auth & error handling
│   │   ├── routes/              # API route handlers
│   │   └── services/            # Stripe & PayPal integrations
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Data seeding script
│   │   └── migrations/          # Database migrations
│   └── package.json
│
└── web/              # React frontend
    ├── src/
    │   ├── pages/               # Route pages
    │   ├── components/          # Reusable components
    │   ├── lib/                 # API utilities
    │   └── styles.css           # Global styles
    └── package.json
```

## 🚀 Tech Stack

### Backend (`server/`)

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.4+
- **ORM**: Prisma 5.20+
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Payment Gateways**: Stripe, PayPal REST SDK
- **Password Hashing**: bcryptjs

### Frontend (`web/`)

- **Framework**: React 19.2
- **Build Tool**: Vite 5.4+
- **Language**: TypeScript 5.4+
- **Styling**: Tailwind CSS 3.4+
- **Routing**: React Router DOM 6.26+
- **HTTP Client**: Axios
- **Charts**: Recharts 2.12+
- **Virtualization**: react-window 1.8+

## 📋 Prerequisites

- **Node.js**: Version 20 or higher
- **Package Manager**: npm or pnpm
- **Database**: SQLite (bundled with Node.js) or PostgreSQL (optional)

## 🔧 Setup Instructions

### 1. Clone and Navigate

```bash
cd payment-platform
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `server/.env` with your configuration:

```env
NODE_ENV=development
PORT=4000

# Database (SQLite for local development)
DATABASE_URL="file:./dev.db"
# For PostgreSQL in production:
# DATABASE_URL="postgresql://user:password@localhost:5432/payment_platform?schema=public"

# JWT Configuration
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Stripe (Test/Sandbox keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (Sandbox)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run seed
```

### 5. Frontend Setup

```bash
cd ../web
npm install
```

### 6. Frontend Environment (Optional)

Create `web/.env` if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:4000
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend:**

```bash
cd web
npm run dev
```

Frontend runs on `http://localhost:5173`

### Production Build

**Backend:**

```bash
cd server
npm run build
npm start
```

**Frontend:**

```bash
cd web
npm run build
npm run preview
```

## 🔐 Default Credentials (Seeded Data)

The seed script creates three test users:

| Email                | Password     | Role     |
| -------------------- | ------------ | -------- |
| admin@example.com    | Password123! | ADMIN    |
| provider@example.com | Password123! | PROVIDER |
| merchant@example.com | Password123! | MERCHANT |

## 📊 Database Schema

### Models

- **User**: Authentication and user profiles (PROVIDER, MERCHANT, ADMIN roles)
- **Account**: Payment accounts owned by users
- **Collaboration**: Provider-Merchant partnerships
- **Quota**: Currency-specific daily/monthly limits per collaboration
- **Payment**: Payment transactions (Stripe/PayPal, status: PENDING, SUCCEEDED, FAILED, REFUNDED)
- **Payout**: Payout requests (status: REQUESTED, PROCESSING, PAID, FAILED)
- **Dispute**: Payment disputes (status: OPEN, UNDER_REVIEW, RESOLVED, REJECTED)

### Note on Enums

SQLite doesn't support native enums, so all enum fields use `String` types. Valid values are enforced at the application level via Zod schemas.

## 🎨 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes on frontend
- Token persistence in localStorage

### Payment Processing

- Multi-currency support (USD, EUR, GBP, INR, AED)
- Stripe integration (Payment Intents)
- PayPal integration (Orders API)
- Payment status tracking
- Refund support

### User Interface

- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark/Light Theme**: System preference detection with manual toggle
- **Hamburger Menu**: Mobile navigation
- **User Menu**: Avatar with dropdown (shows name on desktop, avatar only on mobile)
- **Virtualized Lists**: Efficient rendering for large datasets (react-window)
- **Charts & Analytics**:
  - Pie charts for payment status distribution
  - Bar charts for payout statistics
  - Line charts for payment trends
  - Custom tooltips with theme-aware styling
- **Status Chips**: Color-coded status badges (green, yellow, red, blue, slate)
- **Transparent Scrollbars**: Theme-aware with hover effects

### Dashboard

- Total transactions overview
- Payment status breakdown (pie chart)
- Payout statistics (bar chart)
- Payment trends over time (line chart)
- Dispute tracking
- Top collaboration metrics

### Data Management

- Paginated lists (20 items per page)
- Virtual scrolling for performance
- Real-time data updates
- Comprehensive error handling

## 🛠️ Available Scripts

### Backend (`server/`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run seed` - Seed database with sample data
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Frontend (`web/`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📁 Key Files & Directories

### Backend Structure

```
server/
├── src/
│   ├── index.ts                    # Express app setup, middleware, routes
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication & role checks
│   │   └── error.ts                # Error handling & AppError class
│   ├── routes/
│   │   ├── auth.ts                 # Register & login endpoints
│   │   ├── collaborations.ts       # Collaboration & quota management
│   │   ├── payments.ts             # Payment creation & listing
│   │   ├── payouts.ts              # Payout requests
│   │   └── disputes.ts             # Dispute management
│   └── services/
│       ├── stripe.ts               # Stripe Payment Intent creation
│       └── paypal.ts               # PayPal Order creation
└── prisma/
    ├── schema.prisma               # Database schema definition
    └── seed.ts                     # Seed script (1000 payments, 100 payouts, etc.)
```

### Frontend Structure

```
web/
├── src/
│   ├── App.tsx                     # Main app component (routing, theme, user menu)
│   ├── main.tsx                    # React entry point
│   ├── pages/
│   │   ├── LoginPage.tsx          # Login form
│   │   ├── RegisterPage.tsx       # Registration form
│   │   ├── Dashboard.tsx          # Analytics dashboard with charts
│   │   ├── CollaborationsPage.tsx # Collaboration management
│   │   ├── PaymentsPage.tsx       # Payment list & creation (virtualized)
│   │   ├── PayoutsPage.tsx        # Payout list & creation (virtualized)
│   │   └── DisputesPage.tsx       # Dispute list & creation (virtualized)
│   ├── components/
│   │   ├── ProtectedRoute.tsx     # Route guard component
│   │   └── StatusChip.tsx         # Status badge component
│   ├── lib/
│   │   └── api.ts                 # Axios instance & auth helpers
│   └── styles.css                 # Tailwind directives & global styles
```

## 🔒 Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **Password Hashing**: bcryptjs with salt rounds (10)
3. **Input Validation**: Zod schemas on all API endpoints
4. **CORS**: Configured for development (adjust for production)
5. **Environment Variables**: Never commit `.env` files
6. **SQL Injection**: Prevented via Prisma ORM

## 🌐 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT)

### Collaborations

- `GET /collaborations` - List user's collaborations (requires auth)
- `POST /collaborations` - Create collaboration (requires PROVIDER/ADMIN)
- `POST /collaborations/:id/quotas` - Set/update quotas (requires PROVIDER/ADMIN)

### Payments

- `GET /payments` - List all payments (requires auth)
- `POST /payments` - Create payment (requires auth)

### Payouts

- `GET /payouts` - List all payouts (requires auth)
- `POST /payouts` - Request payout (requires PROVIDER/ADMIN)

### Disputes

- `GET /disputes` - List all disputes (requires auth)
- `POST /disputes` - Create dispute (requires auth)

### Health Check

- `GET /health` - Server health status

## 🎨 UI/UX Features

### Responsive Design

- **Mobile (< 640px)**: Hamburger menu, avatar-only user menu, stacked layouts
- **Tablet (640px - 1024px)**: Side-by-side forms, partial navigation
- **Desktop (> 1024px)**: Full navigation, user name display, multi-column grids

### Theme System

- System preference detection
- Manual toggle (sun/moon icons)
- Persistent theme state
- Theme-aware components (charts, buttons, scrollbars)

### Color Scheme

- **Light Theme**: Blue buttons, gray backgrounds, white cards
- **Dark Theme**: Orange gradient buttons, dark gray backgrounds, slate cards
- **Status Colors**:
  - Green: Success states (SUCCEEDED, PAID, RESOLVED)
  - Yellow: Pending/Warning (PENDING, PROCESSING, UNDER_REVIEW)
  - Red: Failure/Error (FAILED, REJECTED)
  - Blue: Info (REQUESTED, OPEN)
  - Slate: Neutral (REFUNDED)

## 🐛 Troubleshooting

### Database Issues

- Ensure SQLite file permissions are correct
- Run `npx prisma generate` after schema changes
- Use `npx prisma studio` to inspect data

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is 20+
- Check TypeScript version compatibility

### API Connection Issues

- Verify backend is running on port 4000
- Check CORS configuration in `server/src/index.ts`
- Ensure `VITE_API_URL` in frontend matches backend URL

### Payment Gateway Issues

- Verify Stripe/PayPal test keys are correct
- Check network tab for API errors
- Ensure sandbox/test mode is enabled

## 📝 Developer Notes

### Code Style

- TypeScript strict mode enabled
- Consistent naming: camelCase for variables, PascalCase for components
- Import order: external packages → internal modules → relative imports
- No `.tsx` extensions in import statements (auto-resolved)

### State Management

- React hooks (`useState`, `useEffect`, `useMemo`)
- Local component state (no Redux/Zustand)
- localStorage for auth persistence

### Performance Optimizations

- `react-window` for virtualized lists (handles 1000+ items)
- Memoized computations with `useMemo`
- Pagination (20 items per page)
- Responsive images and lazy loading ready

### Error Handling

- Centralized error handler (`server/src/middleware/error.ts`)
- Custom `AppError` class for structured errors
- User-friendly error messages on frontend
- API error responses in consistent format

### Database Best Practices

- Use Prisma migrations for schema changes
- Always seed data in development
- Use transactions for multi-step operations
- Index frequently queried fields (email, account IDs)

### Testing Recommendations

- Add unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test payment gateway integrations in sandbox

### Future Enhancements

- [ ] Add webhook handlers for payment status updates
- [ ] Implement real-time notifications
- [ ] Add file upload support for dispute evidence
- [ ] Build admin dashboard with advanced analytics
- [ ] Implement multi-tenant support
- [ ] Add API rate limiting
- [ ] Implement refresh token rotation
- [ ] Add email notifications
- [ ] Build reporting module

## 📄 License

This project is for educational/portfolio purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding! 🚀**
