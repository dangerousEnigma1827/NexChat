import express from 'express'
import {sendMessage, clearChatInBackend,editMessageController, deleteFromBackendController} from '../controllers/messageControllers.js';
import protectRoute from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.post('/clearchat/:conversationId', protectRoute, clearChatInBackend)
router.post('/send', protectRoute, sendMessage)
router.delete('/delete', protectRoute, deleteFromBackendController)
router.post('/edit', protectRoute, editMessageController)

export default router;