# New Ideal Cutting and Stitching Institute — Online Platform

A full-stack tailoring education platform: React/Vite frontend, Node/Express backend, MongoDB,
Firebase Authentication, Razorpay payments.

## ⚠️ Before you do anything: the phone number gap

The original project brief gave the institute's phone number as `738324007` — **9 digits**, one
short of a valid Indian mobile number. Nothing in this codebase invents the missing digit. You
must confirm the real number with the institute and set it in `server/.env` as `INSTITUTE_PHONE`
before running the seed script — the seed script will refuse to run otherwise. Until that's set,
the site displays "Contact number pending confirmation" instead of a guessed number.

## What's real vs. what needs your input

**Fully implemented and working, once you supply credentials:**
- Firebase email/password + Google auth, with a mirrored MongoDB user profile
- Razorpay checkout with **server-side signature verification** (never trusts the frontend) +
  webhook fallback for dropped connections
- Course/curriculum/lesson content, all admin-editable, nothing hardcoded in the UI
- Enrollment-gated video access — a lesson's `videoUrl` is stripped server-side for anyone
  who isn't enrolled or looking at a free preview
- Full admin panel: courses, curriculum, enrollments, payments, inquiries, testimonials, dashboard stats
- Duplicate-enrollment prevention at the database level (unique index on user+course)

**Needs your real content before launch:**
- `client/src/pages/RefundPolicy.jsx` — the brief didn't specify refund terms. Don't publish as-is.
- `client/src/pages/PrivacyPolicy.jsx` and `Terms.jsx` — template language, have a professional review it.
- Testimonials — none are seeded (real ones only, per the brief). Admin adds them as students provide them.
- The confirmed 10-digit phone number (see above).

---

## Architecture

```
/client            React + Vite + Tailwind (frontend)
  src/
    components/    Reusable UI (layout, course cards, curriculum accordion, home sections)
    pages/          Route-level views (public, /student, /admin)
    layouts/        MainLayout (marketing site), AdminLayout (admin panel)
    contexts/       AuthContext (Firebase + Mongo profile), SiteSettingsContext
    lib/            firebase.js, api.js (axios + auto token), siteConfig.js
    utils/          loadRazorpay.js

/server             Node + Express (backend API)
  src/
    config/         db.js (MongoDB), firebaseAdmin.js
    models/         User, Course, CurriculumModule, Lesson, Enrollment, Payment, Inquiry,
                     Testimonial, SiteSettings
    middleware/      auth.js (Firebase token verify), requireAdmin.js, errorHandler.js, rateLimit.js
    services/       paymentService.js — Razorpay abstraction (swap providers without touching
                     the enrollment flow)
    controllers/    Business logic per resource
    routes/         REST endpoints
    utils/seed.js   Seeds the two real courses + curriculum levels — no fake data
```

## API summary

```
GET    /api/courses                       Public: published courses
GET    /api/courses/:slug                 Public: one course
GET    /api/curriculum/:courseId          Public (gates video URLs by enrollment)
POST   /api/payments/create-order         Auth required
POST   /api/payments/verify               Auth required — server-side signature check
POST   /api/payments/webhook              Razorpay only (signature-verified)
GET    /api/enrollments/me                Auth required
POST   /api/enrollments/progress          Auth required
POST   /api/inquiries                     Public
GET    /api/testimonials                  Public (published only)
GET    /api/settings                      Public site config
GET    /api/admin/dashboard               Admin only
...plus /admin sub-routes on courses, curriculum, inquiries, testimonials for CRUD
```

Every response follows `{ success, message, data }`.

---

## Local development

### 1. Clone and install
```bash
git clone <your-repo-url>
cd new-ideal-institute
cd server && npm install
cd ../client && npm install
```

### 2. Firebase setup
1. [Firebase Console](https://console.firebase.google.com) → Create project
2. Authentication → Sign-in method → enable **Email/Password** (and **Google**, optional)
3. Project Settings → General → Add a **Web app** → copy the config into `client/.env`
   (copy `client/.env.example` → `client/.env` first)
4. Project Settings → **Service Accounts** → Generate new private key → use the three values
   for `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in `server/.env`
   (copy `server/.env.example` → `server/.env` first). Keep the `\n` characters in the private
   key literal — the code un-escapes them at runtime.

### 3. MongoDB Atlas
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create a free cluster
2. Database Access → create a database user
3. Network Access → allow your IP (or `0.0.0.0/0` for early development)
4. Connect → Drivers → copy the connection string into `MONGODB_URI`

### 4. Razorpay
1. [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys → generate
   → `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in `server/.env`, and `VITE_RAZORPAY_KEY_ID`
   (the public key only) in `client/.env`
2. Settings → Webhooks → add `https://your-api-domain/api/payments/webhook`, subscribe to
   `payment.captured` → copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`

### 5. Seed the two real courses
```bash
cd server
# Set INSTITUTE_PHONE to the confirmed 10-digit number first
npm run seed
```

### 6. Run it
```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```
Visit `http://localhost:5173`.

### 7. Create your first admin
There is no public "become admin" endpoint (on purpose — role is never trusted from the
client). Sign up as a normal user, then promote yourself directly in MongoDB Atlas:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
Then log in again so the profile refreshes.

---

## Deployment (Vercel)

Deploy `/client` and `/server` as **two separate Vercel projects** from the same GitHub repo
(set each project's Root Directory accordingly) — a single long-running Express app doesn't run
as-is on Vercel's serverless model, which is why `server/vercel.json` routes everything through
`src/server.js` as a function.

**Backend project:**
- Root Directory: `server`
- Add all `server/.env` variables in Vercel → Settings → Environment Variables

**Frontend project:**
- Root Directory: `client`
- Build Command: `npm run build`, Output Directory: `dist`
- Add all `client/.env` variables, with `VITE_API_BASE_URL` pointing at your deployed backend

### Custom domain
Vercel → Project → Settings → Domains → add your domain → set the DNS records your registrar
asks for → wait for propagation → HTTPS is automatic.

After connecting the domain, update:
- Firebase Console → Authentication → Settings → **Authorized domains** → add your domain
- `server` env: `FRONTEND_URL=https://your-domain.com`
- Razorpay webhook URL to the production backend URL

---

## Production checklist

- [ ] Confirmed real 10-digit phone number set and seeded
- [ ] Firebase authorized domains updated for production URL
- [ ] MongoDB Network Access restricted from `0.0.0.0/0` to Vercel's IP ranges (or use Atlas's
      "allow from Vercel" integration)
- [ ] Razorpay webhook pointed at production URL and verified with a test payment
- [ ] `NODE_ENV=production` set on the backend
- [ ] First admin account created and confirmed
- [ ] Refund policy and legal pages reviewed by someone qualified, not shipped as placeholder text
- [ ] Real testimonials collected before publishing the Testimonials page as prominent
