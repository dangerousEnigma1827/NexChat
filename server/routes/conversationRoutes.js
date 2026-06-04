import express from 'express'
const router = express.Router()
import protectRoute from "../middlewares/authMiddlewares.js";
import { conversationAdd, getAllConversations } from '../controllers/conversationControllers.js';

router.post('/add', protectRoute, conversationAdd)
router.get('/', protectRoute, getAllConversations)

export default router;
