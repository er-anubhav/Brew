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
