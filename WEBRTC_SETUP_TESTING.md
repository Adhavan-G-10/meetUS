# WebRTC Video Chat - Quick Setup & Testing Guide

## Prerequisites
- Node.js v14+ installed
- Two browsers (or two devices on same network)
- Camera/microphone access
- HTTPS enforced in production (for localhost HTTP is fine)

---

## Quick Start

### **1. Install Dependencies (if not already done)**

```bash
# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### **2. Start Backend Server**

```bash
cd server
npm run dev
```

Expected output:
```
========================================
🚀 MeetUS Server Started
📡 listening on port 3000
========================================
```

### **3. Start Frontend Development Server**

In a new terminal:
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### **4. Open in Browser**

- Open http://localhost:5173 in your main browser
- Open http://localhost:5173 in a second browser/tab (or different device)
- Click "Start Chat" on both

---

## Testing WebRTC Video Chat

### **Test Scenario 1: Basic Video Connection**

1. **Browser 1 (User A):**
   - Open app and click "Start Chat"
   - Wait for queue position

2. **Browser 2 (User B):**
   - Open app and click "Start Chat"
   - Should match with User A

3. **Expected Behavior:**
   - Both see matching notification
   - Video window appears with "Connecting..." overlay
   - After ~2-3 seconds, connection status shows "Connected"
   - Both users see each other's video
   - Green connection indicator appears

### **Test Scenario 2: Mute/Unmute Audio**

1. **User A:** Click microphone button
   - Status should toggle (on/off visual)
   - User B cannot hear User A

2. **User A:** Click microphone button again
   - Audio resumes
   - User B can hear User A again

### **Test Scenario 3: Camera On/Off**

1. **User A:** Click camera button
   - Local video shows "Camera Off"
   - User B sees frozen last frame

2. **User A:** Click camera button again
   - Live video resumes
   - User B sees User A again

### **Test Scenario 4: Click "Next"**

1. **Both in connected video chat**
2. **User A:** Click "Next Stranger" button
   - Video immediately stops
   - Cleanup completes
   - Both users disconnected from each other
   - User B sees "Stranger Disconnected"
   - Both can rejoin queue

### **Test Scenario 5: Disconnect (Close Tab)**

1. **User A:** Close browser/tab
   - User B immediately sees "Stranger Disconnected"
   - Video stops
   - Video resources cleaned up

### **Test Scenario 6: Permission Denial**

1. **Browser 2 (new instance):**
   - Match with User A
   - When browser requests camera permission: **Click "Block"**
   - Expected: Error message overlay appears
   - Text chat should still work
   - Video area shows error state

### **Test Scenario 7: Mobile Responsive**

1. **On mobile browser:**
   - Open app
   - Start chat and match
   - Video should stack responsively
   - Controls should be touchable
   - Full-screen video on small screens

---

## Debugging WebRTC Issues

### **Browser Console (F12)**

#### Check WebRTC Logs:
```
[WebRTC] Offer sent from ...
[WebRTC] Answer sent from ...
[WebRTC] Remote track received: video
Connection state: connecting
Connection state: connected
```

#### Check for Errors:
- Look for red errors in console
- Check "Application" tab for permissions
- Monitor network tab for Socket.io events

### **Check Connection Status**

Open DevTools Network tab and filter for `websocket`:
- Should see active Socket.io connection
- WebRTC signaling events should appear

### **Monitor Video Streams**

In Chrome DevTools, go to `chrome://webrtc-internals`:
- Shows all active WebRTC connections
- Displays codec information
- Shows connection statistics (bitrate, resolution, fps)

---

## Common Issues & Solutions

### **Issue: "Camera/microphone access denied"**
**Solution:**
1. Check browser permissions (site settings)
2. Grant camera/mic permissions
3. Reload page
4. Try incognito/private window

### **Issue: Video shows but not responsive**
**Solution:**
1. Check if connection state is "connected"
2. Verify both users in same room
3. Check browser console for errors
4. Try different STUN server or refresh

### **Issue: One-way video (one side sees other, but not vice versa)**
**Solution:**
1. Likely networking issue
2. Check firewall settings
3. Try different network
4. Add TURN server (contact admin)

### **Issue: Connection fails to establish**
**Solution:**
1. Verify both on same network/internet
2. Check Socket.io connection is active
3. Ensure HTTPS in production
4. Check server logs for errors

### **Issue: Video works on desktop but not mobile**
**Solution:**
1. Verify permissions granted on mobile
2. Try different mobile browser
3. Check network connectivity
4. Try portrait/landscape orientation

### **Issue: Audio/Video Echo**
**Solution:**
- Local video is muted (normal behavior)
- Audio echo would come from peer's output
- Ask peer to move microphone away or use headphones

---

## Production Deployment

### **For HTTPS (Required for Production)**

1. **Get SSL Certificate:**
   ```bash
   # Using Let's Encrypt (free)
   certbot certonly --standalone -d yourdomain.com
   ```

2. **Update Server:**
   ```javascript
   import fs from 'fs';
   import https from 'https';
   
   const options = {
     key: fs.readFileSync('/path/to/key.pem'),
     cert: fs.readFileSync('/path/to/cert.pem'),
   };
   
   const server = https.createServer(options, app);
   ```

3. **Update Client:**
   ```
   VITE_SERVER_URL=https://yourdomain.com:3000
   ```

### **Recommended Additions for Production:**

1. **TURN Server** (for users behind restrictive NAT)
   - Coturn (open-source)
   - Deployed on your infrastructure

2. **Monitoring & Logging**
   - Log WebRTC connection failures
   - Monitor connection success rates
   - Alert on high failure rates

3. **Rate Limiting**
   - Already implemented on backend
   - Prevents abuse

4. **GDPR Compliance** (if applicable)
   - Inform users about video streaming
   - Clear data after session
   - No recording by default

---

## Performance Tips

### **Desktop Experience:**
- Ideal for 1280x720 @ 30fps
- Requires ~1 Mbps upload/download
- Modern CPU handles encoding/decoding

### **Mobile Experience:**
- Adapt to device capabilities
- Test on actual devices
- Consider bandwidth limitations

### **Network Optimization:**
- Ensure adequate bandwidth
- Test with network throttling
- Monitor connection quality

---

## Testing on Multiple Devices

### **Local Network Testing:**

1. **Find your computer's IP:**
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet "
   
   # On Windows:
   ipconfig
   ```

2. **Access from other device:**
   - Replace `localhost` with your IP: `http://192.168.x.x:5173`
   - Both devices should be on same network

3. **Test with throttling:**
   - Chrome DevTools → Network → Slow 3G
   - Verify video quality adapts

---

## Test Cases Checklist

### **Functional Tests:**
- [ ] Video displays correctly on both sides
- [ ] Audio works both directions
- [ ] Mute/unmute toggles work
- [ ] Camera on/off toggles work
- [ ] "Next" button disconnects current chat
- [ ] Queue system works after disconnect
- [ ] Can chat multiple rounds without issues

### **Edge Cases:**
- [ ] Rapid next button clicks handled
- [ ] Permissions denied gracefully
- [ ] Browser refresh doesn't crash
- [ ] Close tab/window cleanup
- [ ] Network disconnection handled
- [ ] Long duration chat (30+ min)
- [ ] Mobile responsiveness

### **Error Handling:**
- [ ] Camera access denied
- [ ] Connection timeout
- [ ] ICE gathering timeout
- [ ] Peer disconnects unexpectedly
- [ ] Browser unsupported gracefully

### **Performance:**
- [ ] No memory leaks after 10+ chats
- [ ] Video quality maintained
- [ ] CPU usage reasonable
- [ ] No UI lag or freezing

---

## Logs to Check

### **Server Logs:**
```
[WebRTC] Offer sent from socket_id_a to socket_id_b in room room_id
[WebRTC] Answer sent from socket_id_b to socket_id_a in room room_id
[WebRTC] ICE candidates exchanged
```

### **Browser Console Logs:**
```
Matched: {roomId, yourId, peerId}
Remote track received: video
Remote track received: audio
Connection state: connected
```

---

## Troubleshooting Checklist

- [ ] Browser has camera/mic permissions
- [ ] HTTPS enabled (production)
- [ ] Both users in same room
- [ ] Socket.io connection active
- [ ] STUN servers responsive
- [ ] No firewall blocking WebRTC
- [ ] Not using VPN (sometimes blocks WebRTC)
- [ ] Browser supports WebRTC (check `chrome://webrtc-internals`)

---

## Getting Help

### **Check These Resources:**
1. **Console Errors:** DevTools → Console tab
2. **Network Activity:** DevTools → Network tab
3. **WebRTC Stats:** `chrome://webrtc-internals` (Chrome)
4. **Server Logs:** Terminal where backend is running
5. **Integration Guide:** See `WEBRTC_INTEGRATION.md`

---

## Next Steps

After successful testing:

1. **Deploy to Production:**
   - Use HTTPS
   - Set proper environment variables
   - Configure TURN server for better connectivity

2. **Monitor:**
   - Track connection success rates
   - Log connection failures
   - Monitor resource usage

3. **Optimize:**
   - Adjust video quality based on user feedback
   - Add more STUN/TURN servers if needed
   - Implement bandwidth adaptation

4. **Enhance:**
   - Add screen sharing
   - Add video recording
   - Add user profiles/ratings

---

**Happy Testing! 🎉**

For issues, check the WEBRTC_INTEGRATION.md for detailed technical information.
