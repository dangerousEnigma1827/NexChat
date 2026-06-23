<div align="center">

# 💬 NexChat

### Real-Time Community & Private Messaging Platform

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,vite" />
</p>

**A MERN + Socket.IO based real-time chat application with private chats, groups, media sharing, message control, and live updates.**

</div>

---

# 🌐 Live Demo

🚀 **Try NexChat here:**   👉 https://nexchat-sulq.onrender.com

---

# 📋 Overview

<p align="center">
  NexChat is a real-time MERN stack chat application with Socket.IO,supporting private and group messaging, media sharing, and live updates with features like message edit, delete, and conversation tracking.
</p>



# ⚡ Features

- 💬 Private real-time messaging  
- 👥 Group chat system  
- ⚡ Socket.IO powered live updates  
- 🖼️ Image sharing  
- ✏️ Edit messages  
- 🗑️ Delete messages (for self / everyone)  
- 📌 Last message tracking in conversations     
---


# 🖼️ UI Overview

## Private Chat
<p align="center">
  <img src="/client/public/prev2.png" width="900"/>
</p>

## Group Chat
<p align="center">
  <img src="/client/public/prev1.png" width="900"/>
</p>

---


# 📁 Folder Structure

```
NexChat/
│
├── client/                 
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── App.jsx
│
├── server/
│   ├── config/               
│   ├── controllers/
│   ├── middlewares/
│   ├── models/            
│   ├── routes/
│   ├── socket/            
│   ├── utils/ 
│   ├── server.js
│
├── .gitignore
├── README.md
```

---

# 🚀 Setup Instructions

## 1. Clone the repository
```bash
git clone https://github.com/your-username/nexchat.git
cd nexchat
```

## 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```
Create `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run backend:
```bash
npm run dev
```

## 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## 4. Run Full App
- Backend: http://localhost:5000  
- Frontend: http://localhost:5173  

---


<div align="center">

## Built by dangerousEnigma

</div>
