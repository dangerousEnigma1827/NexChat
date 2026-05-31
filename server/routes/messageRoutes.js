import express from 'express'
import {getMessages, sendMessage, clearChatInBackend,editMessageController, deleteFromBackendController} from '../controllers/messageControllers.js';
import protectRoute from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get('/getMessages/:currentUserId/:userSeleted', protectRoute, getMessages)
router.post('/clearchat/:currentUserId/:userSeleted', protectRoute, clearChatInBackend)
router.post('/send', protectRoute, sendMessage)
router.delete('/delete', protectRoute, deleteFromBackendController)
router.post('/edit', protectRoute, editMessageController)

export default router;