# MeetUS - Anonymous Chat Application

## 📦 Project Contents

This is a **production-ready anonymous random chat web application** similar to Omegle/Umingle.

### What's Inside

```
meetUS/
├── server/                 # Node.js + Express + Socket.io backend
├── client/                 # React + Vite + TailwindCSS frontend
├── README.md              # Comprehensive documentation
├── SETUP.md               # Detailed setup guide
├── setup.sh               # Automated setup script
├── verify.sh              # Installation verification
├── docker-compose.yml     # Docker deployment config
└── .gitignore
```

---

## 🚀 Quick Start (Choose One)

### Option A: Automated Setup (Recommended - 30 seconds)

```bash
bash setup.sh
```

Then follow the on-screen instructions.

### Option B: Manual Setup (2 minutes)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

### Option C: Docker Setup

```bash
docker-compose up --build
```

Open **http://localhost:5173**

---

## ✨ Features

✅ Anonymous one-to-one random chat
✅ Real-time messaging with Socket.io
✅ Queue-based user matching system
✅ Skip to next user instantly
✅ Typing indicators
✅ Live online user counter
✅ Message profanity filtering
✅ Rate limiting & anti-abuse
✅ Glassmorphism UI design
✅ Fully responsive (mobile + desktop)
✅ Sound notifications
✅ Production-ready with Docker

---

## 📚 Documentation

- **[README.md](README.md)** - Full feature & architecture documentation
- **[SETUP.md](SETUP.md)** - Detailed setup, troubleshooting & deployment
- **[server/README.md](server/README.md)** - Backend API documentation
- **[client/README.md](client/README.md)** - Frontend guide

---

## 🏗️ Architecture

### Backend
- **Node.js + Express**: RESTful API & HTTP server
- **Socket.io**: Real-time bidirectional communication
- **Queue Manager**: FIFO matching system
- **Room Manager**: Paired user room management
- **Rate Limiter**: Anti-spam & anti-abuse
- **Profanity Filter**: Message content filtering

### Frontend
- **React 18**: UI framework
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Modern utility-first CSS
- **Socket.io Client**: Real-time messaging
- **Web Audio API**: Sound notifications

---

## 🔧 Tech Stack

```
Backend:  Node.js, Express, Socket.io, CORS
Frontend: React, Vite, TailwindCSS, Socket.io-client
Ops:      Docker, Docker Compose
```

---

## 📞 Support

1. **Installation issues?** → Run `bash verify.sh`
2. **Connection problems?** → Check port 3000/5173 availability
3. **Need help?** → See [SETUP.md](SETUP.md) troubleshooting section

---

## 📄 License

MIT License - Free for personal and commercial projects

---

**Ready to chat? Let's go! 🚀**
