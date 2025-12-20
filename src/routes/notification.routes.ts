import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getMyNotifications,
  getMyUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getMyNotifications);
router.get("/unread", getMyUnreadNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead);

export default router;
