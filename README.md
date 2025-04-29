# Chatzy

**Chatzy** is a real-time messaging application inspired by **Discord** and **WhatsApp**.

It focuses on **professional-grade architecture**, **instant communication**, and **modern fullstack technologies** with **real WebSocket synchronization**.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Bun + Hono (REST + WebSocket)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) via `jose`
- **Realtime**: WebSocket (native support via Bun)

---

## ✨ Features

- 🔐 **Authentication**
  - Secure login & registration with JWT tokens
  - Auto-refresh, protected frontend routes
- 🧑‍🤝‍🧑 **Friends system**
  - Send / accept / reject friend requests
  - View friends list
- 💬 **Direct Conversations**
  - One-on-one chats
  - Conversation creation if not existing
- 📡 **Real-time Messaging**
  - Instant WebSocket message delivery
  - Smart scrolling (auto-scroll if at bottom)
- 🗄️ **Message Persistence**
  - Messages saved in PostgreSQL
  - Fetch conversation history on open
- 🌐 **REST API**
  - `/api/auth` – Authentication (register, login, get profile)
  - `/api/users` – User management
  - `/api/friends` – Friend requests and list
  - `/api/conversations` – Direct conversations
  - `/api/messages` – Messages CRUD
- 🧠 **Modular architecture**
  - Organized routes, middleware, and database layers
  - Scalable WebSocket server (one socket per user)

---

## 🔥 In Progress

- [x] JWT authentication
- [x] WebSocket messaging
- [x] Conversations and message persistence
- [x] Friends & requests system
- [ ] Typing indicators (in conversation)
- [ ] Avatars & custom user profiles
- [ ] Message read receipts
- [ ] Online/offline presence (WebSocket)
- [ ] Group conversations (multi-user chats)
- [ ] Dark Mode UI

---

## 📦 Deployment

- Backend server runs on **Hetzner VPS** with Bun & PM2
- PostgreSQL database hosted externally
- Git-based deployment (automated with SSH)

---

## 🧩 Technologies Used

| Tech             | Purpose                        |
|------------------|--------------------------------|
| React            | Frontend UI                    |
| Vite             | Frontend dev/build tool         |
| Hono             | Lightweight backend framework  |
| Bun              | Fast server runtime             |
| Drizzle ORM      | Type-safe database access      |
| PostgreSQL       | Data storage                    |
| WebSocket        | Real-time communication         |
| JWT (jose)       | Auth and session management     |

---

# 🛡️ Security

- Full JWT-based authentication
- User-to-user message isolation
- Protected WebSocket connections
- Payload validation and error handling
- Environment secrets secured (JWT secret, DB creds)

---

# 🛠️ Local Development

```bash
# Start frontend
cd client
npm install
npm run dev

# Start backend
cd server
bun install
bun dev
```

---

# ❤️ About

**Chatzy** is built to serve as a learning project for professional-grade real-time applications, scaling towards **a full Discord-like experience**.
