import express from "express";
import { register, login, me, allUsers, editProfile} from "../controllers/authControllers.js";
import protectRoute from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/me', protectRoute, me)
router.get('/allUsers', protectRoute, allUsers)
router.post('/me/edit', protectRoute, editProfile)

export default router;