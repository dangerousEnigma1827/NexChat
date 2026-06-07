import express from 'express'
const router = express.Router()
import protectRoute from "../middlewares/authMiddlewares.js";
import { conversationAdd, getAllConversations, getAllMessagesOfAConversation, getAllSingleUsers } from '../controllers/conversationControllers.js';

router.post('/add', protectRoute, conversationAdd)
router.get('/', protectRoute, getAllConversations)
router.get('/allMessagesOfAConversation/:conversationId', protectRoute, getAllMessagesOfAConversation)
router.get('/getAllSingleUsers', protectRoute, getAllSingleUsers)

export default router;
