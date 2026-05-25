import express from 'express'
import {getMessages, sendMessage, clearChatInBackend, deleteFromBackendController} from '../controllers/messageControllers.js';
import protectRoute from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get('/getMessages/:currentUserId/:userSeleted', protectRoute, getMessages)
router.post('/clearchat/:currentUserId/:userSeleted', protectRoute, clearChatInBackend)
router.post('/send', protectRoute, sendMessage)
router.delete('/delete/:messageToDelete/:typeOf', protectRoute, deleteFromBackendController)

export default router;