> 🇧🇷 [Versão em português](./README.pt-BR.md)

# Broadcast

SaaS platform for managing broadcast message campaigns with real-time scheduling — built with React, TypeScript, and Firebase.

Each account has its own workspace. Connections group contacts, and messages can be sent immediately or scheduled for a future time. Scheduled messages transition to *sent* automatically via a Cloud Function that runs every minute.

## Stack

- **Frontend:** React 18, TypeScript, Vite, Material UI, Tailwind CSS
- **Backend:** Firebase Auth, Firestore (real-time), Cloud Functions (scheduled)
- **Deploy:** Firebase Hosting

## Getting started

Clone the repo and install dependencies in both workspaces:

```bash
# Frontend
cd web
npm install

# Cloud Functions
cd ../functions
npm install
```

Create a `.env` file inside `web/` based on `.env.example` and fill in your Firebase project credentials.

```bash
cd web
cp .env.example .env
```

Start the dev server:

```bash
cd web
npm run dev
```

To run the Functions emulator locally:

```bash
firebase emulators:start --only functions,firestore
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

## Project structure

```
broadcast/
├── functions/        # Cloud Functions (Node.js + TypeScript)
│   └── src/
│       └── index.ts  # Scheduled dispatcher: updates messages from scheduled → sent
└── web/              # React app (Vite)
    └── src/
        ├── contexts/ # AuthContext, ConnectionContext
        ├── hooks/    # useConnections, useContacts, useMessages
        ├── pages/    # LoginPage, ConnectionsPage, ContactsPage, MessagesPage
        ├── services/ # Firestore write operations (functional, no classes)
        └── types/    # Shared TypeScript interfaces
```

## Deploying

Build the frontend and deploy everything in one step:

```bash
cd web && npm run build && cd ..
firebase deploy --only hosting,functions
```

## Data isolation

Firestore Security Rules ensure each user can only read and write their own data. Every document in `connections`, `contacts`, and `messages` carries a `userId` field that is checked against `request.auth.uid` on every operation. No data leaks between accounts.