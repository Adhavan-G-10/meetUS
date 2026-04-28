# MeetUS - Anonymous Random Chat Web Application

A production-ready anonymous chat application similar to Omegle/Umingle, built with the MERN stack and Socket.io for real-time communication.

## 🚀 Features

### Core Features
- ✅ Anonymous user connection (no authentication required)
- ✅ Random one-to-one user pairing using queue-based matching
- ✅ Real-time chat using Socket.io
- ✅ "Next" button to skip and connect to new stranger
- ✅ Proper disconnect and reconnection handling
- ✅ Typing indicators
- ✅ Live online user count
- ✅ Message profanity filtering
- ✅ Rate limiting and anti-abuse measures
- ✅ Sound notifications on match/disconnect

### Technical Features
- 🏗️ Modular backend architecture
- 💾 In-memory storage (no database)
- 🎨 Modern glassmorphism UI with TailwindCSS
- 📱 Fully responsive (mobile + desktop)
- ⚡ Production-ready with Docker support
- 🔒 CORS-enabled for security
- 🎯 Queue-based matching system

## 📁 Project Structure

```
meetUS/
├── server/                    # Node.js + Express + Socket.io backend
│   ├── handlers/
│   │   └── socketHandlers.js # Socket event handlers
│   ├── managers/
│   │   ├── QueueManager.js   # Queue management
│   │   └── RoomManager.js    # Room/pair management
│   ├── utils/
│   │   ├── profanityFilter.js # Message filtering
│   │   └── RateLimiter.js    # Rate limiting
│   ├── server.js             # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── client/                    # React + Vite + TailwindCSS frontend
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Page components
    │   ├── utils/           # Utility functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+ and npm/yarn
- Git (optional)

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Create Backend .env File

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development):
```
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Expected output:
```
========================================
🚀 MeetUS Server Started
========================================
Server: http://localhost:3000
Client: http://localhost:5173
Environment: development
========================================
```

### Step 4: Install Frontend Dependencies

In a new terminal:

```bash
cd client
npm install
```

### Step 5: Start Frontend Dev Server

```bash
npm run dev
```

Expected output:
```
  VITE v4.4.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 6: Open Application

Visit **`http://localhost:5173`** in your browser

---

## 📱 Using the Application

1. **Home Page**: Click "Start Chat" to begin
2. **Waiting**: You'll be matched with a random stranger or wait in queue
3. **Chatting**: Once matched, messages appear in real-time
4. **Next**: Click "Next Stranger" to skip and find someone new
5. **Disconnect**: Closing the app or tab will notify the peer

---

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Backend
docker build -t meetus-server ./server

# Frontend
docker build -t meetus-client ./client
```

### Run with Docker Compose

```bash
docker-compose up
```

Access the application at `http://localhost:5173`

---

## 🔧 API & Socket Events

### REST API Endpoints

- `GET /health` - Server health check
- `GET /api/stats` - Get server statistics

### Socket Events

#### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `startChat` | - | Start looking for a match |
| `sendMessage` | `{ message, roomId }` | Send message to peer |
| `typing` | `{ roomId, isTyping }` | Send typing indicator |
| `nextUser` | `{ roomId }` | Skip to next user |
| `getStats` | - | Request statistics |

#### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `connected` | `{ userId, onlineUsers }` | Connection confirmed |
| `matched` | `{ roomId, yourId, peerId }` | Matched with peer |
| `receiveMessage` | `{ message, senderType, timestamp }` | Receive peer message |
| `peerTyping` | `{ isTyping }` | Peer typing status |
| `peerDisconnected` | `{ reason }` | Peer disconnected |
| `waitingInQueue` | `{ position, waitingUsers }` | Queue position update |
| `readyForNextChat` | - | Ready for next chat |
| `stats` | `{ onlineUsers, waitingUsers, activeChats, totalChats }` | Server stats |
| `onlineUsers` | `{ count }` | Online user count |
| `error` | `string` | Error message |

---

## ⚙️ Configuration

### Backend Defaults
- **Max Messages/sec**: 5
- **Next Button Cooldown**: 1000ms
- **Typing Indicator Timeout**: 3000ms
- **Room Cleanup**: Immediate on disconnect
- **Profanity**: Censored with asterisks

### Frontend Config
Edit `.env.local` in client folder:
```
VITE_SERVER_URL=http://localhost:3000
```

---

## 🎨 UI Components

### HomePage
- Welcome screen with online user count
- Start Chat button
- Information cards

### ChatPage
- Real-time chat window with message bubbles
- Message input with typing indicator
- Status indicator (Connecting/Connected/Disconnected)
- Next Stranger button
- Queue position display (when waiting)

### Components Used
- `ChatWindow` - Message display area
- `MessageInput` - Input form with send button
- `StatusIndicator` - Connection status display
- `LoadingAnimation` - Matching/waiting animation

---

## 📊 Queue & Matching System

### How Matching Works

```
User A connects → Queue empty? → Enter queue
                  ↓
User B connects → Queue has User A? → Create room with A+B
                  ↓
                  No queue → Enter queue
```

### Room Management
- Rooms created as `room_{user1}_{user2}_{timestamp}`
- Peer sockets stored in room object
- Room cleanup on both users leaving

### Queue Management
- Array-based FIFO queue
- Position tracking for waiting users
- Automatic removal on match or disconnect

---

## 🛡️ Security & Best Practices

✅ **CORS Protection**: Frontend origin validated
✅ **Rate Limiting**: Prevents message spam and button mashing
✅ **Profanity Filter**: Server-side message filtering
✅ **No Data Storage**: All data in-memory (not persisted)
✅ **Anonymous**: No personal information collected
✅ **Socket Authentication**: Room verification on messages
✅ **Graceful Shutdown**: Clean server termination

---

## 🚀 Production Deployment

### Environment Setup

```bash
# Backend
PORT=3000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

### Deploy with Docker

```bash
# Using Docker Compose
docker-compose up -d

# Or manual
docker run -d -p 3000:3000 -e NODE_ENV=production meetus-server
docker run -d -p 80:5173 meetus-client
```

### Deploy on Heroku

```bash
# Backend
heroku create meetus-server
git push heroku main
heroku config:set CLIENT_URL=https://meetus-client.herokuapp.com

# Frontend
heroku create meetus-client
git push heroku main
heroku config:set VITE_SERVER_URL=https://meetus-server.herokuapp.com
```

---

## 📈 Monitoring & Stats

Access server statistics:

```bash
curl http://localhost:3000/api/stats
```

Response:
```json
{
  "activeUsers": 5,
  "waitingUsers": 2,
  "activeChats": 3,
  "totalChats": 45,
  "totalConnections": 120
}
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: Check `VITE_SERVER_URL` in client `.env.local`

### Issue: "Too many messages" error
**Solution**: Rate limiting active - wait 1 second between messages

### Issue: Stuck in queue
**Solution**: Refresh page or close/reopen application

### Issue: Messages not appearing
**Solution**: Check browser console for errors, verify Socket.io connection

---

## 📝 Tech Stack

**Backend**:
- Node.js
- Express.js
- Socket.io
- CORS

**Frontend**:
- React 18
- Vite
- TailwindCSS
- Socket.io Client
- Web Audio API

**Deployment**:
- Docker
- Docker Compose

---

## 📄 License

MIT License - Feel free to use for personal/commercial projects

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests or open issues.

---

## 📞 Support

For issues or questions, create an issue in the repository.

---

**Built with ❤️ by Senior Full-Stack Engineer**
