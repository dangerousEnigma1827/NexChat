import express from 'express'
const router = express.Router()
import protectRoute from "../middlewares/authMiddlewares.js";
import { userSearchController } from '../controllers/userControllers.js';

router.post('/search', protectRoute, userSearchController)

export default router;
