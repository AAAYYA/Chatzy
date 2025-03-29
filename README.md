# Chatzy

**Chatzy** is a modern web-based messaging app inspired by WhatsApp.

It focuses on clean design, real-time communication, and a lightweight architecture built with modern tools.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Bun + Hono (with REST & WebSocket support)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (via `jose`)
- **Realtime**: WebSocket (via Bun native support)

---

## ✨ Features

- 🔐 **Authentication system**
  - Register and login with JWT tokens
  - Client-side token storage and route protection
- 💬 **Chat page**
  - Message list with user ID tracking
  - Auth-protected message creation
- 📡 **REST API**
  - Auth routes (`/api/auth`)
  - Messages routes (`/api/messages`)
  - User management (`/api/users`)
- 🌐 **WebSocket base**
  - Ready for real-time message broadcasting
- 🧠 **Modular architecture**
  - Clear route separation
  - Middleware-based authentication
  - Drizzle ORM schema and query organization

---

## 🧪 In Progress

- [x] JWT Auth (register/login)
- [x] Message system (CRUD)
- [x] Basic WebSocket setup
- [x] Client-side routing with protected pages
- [ ] Real-time updates via WebSocket
- [ ] Typing indicators
- [ ] Avatars & user profiles
- [ ] Direct conversations
- [ ] Dark mode
