# SkillSwap — Freelance Micro-Task Platform

A full-stack freelance marketplace where clients post tasks and freelancers submit proposals, get hired, and get paid via Stripe.

**Live Site:** [https://taskhive-eight-phi.vercel.app](https://taskhive-eight-phi.vercel.app)

---

## Key Features

- **3 Role System** — Client, Freelancer, Admin with protected dashboards
- **Authentication** — BetterAuth with Email/Password and Google OAuth
- **JWT Middleware** — Secure HTTPOnly cookie-based JWT for protected API routes
- **Task Management** — Post, edit, delete tasks with real-time status updates
- **Proposal System** — Freelancers apply with bid, days, and cover note
- **Stripe Payments** — Secure checkout before work begins
- **Search & Filter** — Browse tasks by title search and category filter
- **Pagination** — Server-side pagination with 9 tasks per page
- **Dark/Light Theme** — Toggle with localStorage persistence
- **Admin Dashboard** — Manage users (block/unblock), tasks, and transactions
- **Responsive Design** — Mobile, tablet, and desktop layouts

---

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- BetterAuth (client)
- Axios
- Tailwind CSS
- Stripe.js

### Backend
- Node.js + Express
- MongoDB + Mongoose
- BetterAuth (server)
- Stripe
- JSON Web Token (jsonwebtoken)
- cookie-parser

---

## NPM Packages Used

### Frontend (`skillswap-client`)
| Package | Purpose |
|---|---|
| `next` | React framework |
| `better-auth` | Authentication |
| `axios` | HTTP requests |
| `@stripe/stripe-js` | Stripe frontend |
| `tailwindcss` | Styling |

### Backend (`skillswap-server`)
| Package | Purpose |
|---|---|
| `express` | Web server |
| `mongoose` | MongoDB ODM |
| `better-auth` | Auth server |
| `stripe` | Payment processing |
| `jsonwebtoken` | JWT generation/verification |
| `cookie-parser` | Cookie parsing |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |

---

## Database Collections (MongoDB)

- **users** — name, email, role, skills, bio, isBlocked
- **tasks** — title, category, description, budget, deadline, status
- **proposals** — task_id, freelancer_email, budget, days, cover_note, status
- **payments** — client_email, freelancer_email, task_id, amount, status
- **reviews** — task_id, rating, comment

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin1@taskhive.com | admin1@taskhive.com |
| Freelancer | freelanceruser3@gmail.com | freelanceruser3@gmail.com |

---

## GitHub Repositories

- **Frontend:** https://github.com/siam70344-source/skillswap-client
- **Backend:** https://github.com/siam70344-source/skillswap-server

---

## Local Setup

### Backend
```bash
cd skillswap-server
npm install
# Create .env with MONGODB_URI, BETTER_AUTH_SECRET, STRIPE_SECRET_KEY
node index.js
```

### Frontend
```bash
cd skillswap-client
npm install
# Create .env.local with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BETTER_AUTH_URL
npm run dev
```

---

© 2026 SkillSwap. All rights reserved.