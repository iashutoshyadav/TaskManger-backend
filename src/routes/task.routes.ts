import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as controller from "../controllers/task.controller";

const router = Router();
router.use(authMiddleware);

router.post("/", controller.createTask);
router.get("/", controller.getTasks);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

export default router;
