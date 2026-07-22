# JK Receipt v0.2 — Interactive Receipt Telemetry Scanner

Industrial, monochromatic receipt telemetry scanner built with Next.js 16, Drizzle ORM, PostgreSQL, and Docker.

---

## 🛠️ Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 🗄️ Database Management (Drizzle ORM & Kit)

```bash
# Generate database migration files from schema
npm run db:generate

# Push schema directly to database
npm run db:push

# Open Drizzle Studio database UI
npm run db:studio
```

---

## 🐙 Push Code to GitHub

```bash
# 1. Stage all changes & commit
git add .
git commit -m "feat: setup drizzle kit & docker deployment for port 3011"

# 2. Ensure main branch is set & remote URL is attached
git branch -M main
git remote add origin https://github.com/KauTryKauCuba/jk-receipt-v0.2.git

# 3. Push to GitHub
git push -u origin main
```

---

## 🚀 Deploy on VPS via Docker (Running on http://localhost:3011)

To pull and run on your VPS server:

```bash
# 1. Clone repository on your VPS
git clone https://github.com/KauTryKauCuba/jk-receipt-v0.2.git
cd jk-receipt-v0.2

# 2. Copy environment file
cp .env.example .env

# 3. Start application and PostgreSQL database with Docker Compose
docker compose up -d --build
```

Access your application at **`http://localhost:3011`** (or `http://YOUR_VPS_IP:3011`)!

---

## 🐳 Useful Docker Commands

```bash
# View running logs
docker compose logs -f

# Restart containers
docker compose restart

# Stop containers
docker compose down
```
