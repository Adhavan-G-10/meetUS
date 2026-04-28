# MeetUS Client

Production-ready React frontend for anonymous chat application.

## Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

Application will start on `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env.local` file for custom configuration:

```
VITE_SERVER_URL=http://localhost:3000
```

## Features

- **Modern UI**: Glassmorphism design with TailwindCSS
- **Responsive**: Works perfectly on mobile and desktop
- **Real-time Chat**: Socket.io integration for instant messaging
- **Typing Indicators**: See when stranger is typing
- **User Status**: Track connection status and queue position
- **Online Counter**: Live count of users online
- **Sound Notifications**: Audio feedback on match/disconnect
- **Auto-scroll**: Messages automatically scroll to latest
- **Smooth Animations**: Fade-in and slide-up animations

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx       # Message display
│   │   ├── MessageInput.jsx     # Input form
│   │   ├── StatusIndicator.jsx  # Connection status
│   │   └── LoadingAnimation.jsx # Loading spinner
│   ├── hooks/
│   │   └── useChat.js           # Socket integration
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   └── ChatPage.jsx         # Chat interface
│   ├── utils/
│   │   └── socket.js            # Socket initialization
│   ├── App.jsx                  # Main component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Socket.io Client** - Real-time communication
- **Web Audio API** - Sound notifications
