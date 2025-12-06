# Brew Monorepo

A monorepo containing the backend API, web application, and mobile application.

## Project Structure

```
/
├── backend/     # Express + TypeScript API
├── web/         # Next.js + TypeScript web app
└── mobile/      # Expo + TypeScript mobile app
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend API will run on `http://localhost:3000`

### Web

```bash
cd web
npm install
npm run dev
```

The web application will run on `http://localhost:3000` (or next available port)

### Mobile

```bash
cd mobile
npm install
npm start
```

Follow the Expo CLI instructions to run on iOS, Android, or web.

## Tech Stack

- **Backend**: Express.js, TypeScript, Node.js
- **Web**: Next.js, React, TypeScript, Tailwind CSS
- **Mobile**: Expo, React Native, TypeScript

## Development

Each project can be developed independently. Navigate to the respective directory and follow the instructions above.

## Deployment

The backend API is deployed on Railway:

**Production URL:**
```
https://brew-production.up.railway.app
```

### Health Check
To verify the deployment is live:

```bash
curl https://brew-production.up.railway.app/
```

Expected response:
```
{"success":true,"data":{"message":"Backend API is running","environment":"production","version":"1.0.0"}}
```

### Example API Endpoints

- Health: `GET /`
- Signup: `POST /auth/signup`
- Login: `POST /auth/login`
- Tasks: `GET /tasks` (requires JWT)

You can use Postman, Insomnia, or PowerShell's `Invoke-RestMethod` to test endpoints.

**Example (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://brew-production.up.railway.app/"
```

See backend/DEPLOYMENT.md for more details.
