# SkillSwap — Freelance Micro-Task Platform

A freelance micro-task marketplace where clients post tasks and freelancers apply with proposals.

## Live Site
[https://skillswap-client.vercel.app](https://skillswap-client.vercel.app)

## Key Features
- Email/Password and Google OAuth authentication (BetterAuth)
- Client dashboard: Post tasks, manage proposals, Stripe payments
- Freelancer dashboard: Browse tasks, submit proposals, track earnings
- Admin dashboard: Manage users, tasks, transactions
- Search, filter, and pagination on Browse Tasks
- JWT-based route protection
- Stripe Checkout payment integration
- Fully responsive UI

## NPM Packages Used
### Frontend
- next, react, react-dom
- better-auth
- axios
- @stripe/stripe-js
- tailwindcss

### Backend
- express
- mongoose
- cors
- dotenv
- stripe
- jsonwebtoken
- cookie-parser

## Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin1@taskhive.com | admin1@taskhive.com |
| Freelancer | freelanceruser3@gmail.com | freelanceruser3@gmail.com |