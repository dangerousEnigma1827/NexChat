import express from 'express'
import getMessages from '../controllers/messageControllers.js';
import protectRoute from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get('/:chatId', protectRoute, getMessages)

export default router;