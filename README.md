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

🚀 **Try NexChat here:**  
👉 https://YOUR-DEPLOYMENT-LINK.com

---

# 📋 Overview

NexChat is a real-time community messaging platform built using the MERN stack with Socket.IO integration.

It supports:
- Private 1-to-1 messaging  
- Group chats  
- Real-time communication  
- Media sharing (images/attachments)  
- Message edit & delete (self/everyone)  
- Conversation tracking with last message sync  
- Online-style instant updates using sockets  

---

# 🖼️ UI Overview

## Dashboard
<p align="center">
  <img src="https://your-image-link.com/dashboard.png" width="900"/>
</p>

## Private Chat
<p align="center">
  <img src="https://your-image-link.com/private-chat.png" width="900"/>
</p>

## Group Chat
<p align="center">
  <img src="https://your-image-link.com/group-chat.png" width="900"/>
</p>

## Media Sharing
<p align="center">
  <img src="https://your-image-link.com/media.png" width="900"/>
</p>

---

# ⚡ Features

- 💬 Private real-time messaging  
- 👥 Group chat system  
- ⚡ Socket.IO powered live updates  
- 🖼️ Image & attachment sharing  
- ✏️ Edit messages  
- 🗑️ Delete messages (for self / everyone)  
- 📌 Last message tracking in conversations  
- 👤 User authentication system  
- 🔄 Instant UI sync across users  
- 📱 Clean responsive UI (Tailwind + Flowbite)  

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
│   └── package.json
│
├── server/
│   ├── config/               
│   ├── controllers/
│   ├── middleware/
│   ├── models/            
│   ├── routes/
│   ├── socket/            
│   ├── utils/ 
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
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

## Built with ❤️ by dangerousEnigma

</div>
