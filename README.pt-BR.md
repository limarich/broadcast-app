> 🇺🇸 [English version](./README.md)

# Broadcast

Plataforma SaaS para gerenciar campanhas de mensagens em broadcast com agendamento em tempo real — construída com React, TypeScript e Firebase.

Cada conta tem seu próprio workspace. Conexões agrupam contatos, e mensagens podem ser enviadas imediatamente ou agendadas para um horário futuro. As mensagens agendadas transitam para *enviadas* automaticamente via Cloud Function que roda a cada minuto.

## Demo

[https://broadcast-app-8ba79.web.app](https://broadcast-app-8ba79.web.app)

## Stack

- **Frontend:** React 18, TypeScript, Vite, Material UI, Tailwind CSS
- **Backend:** Firebase Auth, Firestore (tempo real), Cloud Functions (agendada)
- **Deploy:** Firebase Hosting

## Rodando localmente

Clone o repositório e instale as dependências nos dois workspaces:

```bash
# Frontend
cd web
npm install

# Cloud Functions
cd ../functions
npm install
```

Crie um arquivo `.env` dentro de `web/` a partir do `.env.example` e preencha com as credenciais do seu projeto Firebase:

```bash
cd web
cp .env.example .env
```

Suba o servidor de desenvolvimento:

```bash
cd web
npm run dev
```

Para rodar o emulador de Functions localmente:

```bash
firebase emulators:start --only functions,firestore
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key do projeto Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

## Estrutura do projeto

```
broadcast/
├── functions/        # Cloud Functions (Node.js + TypeScript)
│   └── src/
│       └── index.ts  # Dispatcher agendado: atualiza mensagens de scheduled → sent
└── web/              # App React (Vite)
    └── src/
        ├── contexts/ # AuthContext, ConnectionContext
        ├── hooks/    # useConnections, useContacts, useMessages
        ├── pages/    # LoginPage, ConnectionsPage, ContactsPage, MessagesPage
        ├── services/ # Operações de escrita no Firestore (funcional, sem classes)
        └── types/    # Interfaces TypeScript compartilhadas
```

## Deploy

Faça o build do frontend e publique tudo em um único comando:

```bash
cd web && npm run build && cd ..
firebase deploy --only hosting,functions
```

## Isolamento de dados

As Security Rules do Firestore garantem que cada usuário acesse apenas seus próprios dados. Todo documento em `connections`, `contacts` e `messages` carrega um campo `userId` que é validado contra `request.auth.uid` em cada operação. Nenhum dado vaza entre contas.