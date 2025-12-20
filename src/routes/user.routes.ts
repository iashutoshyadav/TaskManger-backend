import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMe, updateMe } from "../controllers/user.controller";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.put("/me", updateMe);

export default router;
