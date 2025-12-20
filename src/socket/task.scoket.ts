import { Server } from "socket.io";

/**
 * Task-related socket helpers
 * Used ONLY from services
 */
export const registerTaskSocket = (io: Server) => {
  /**
   * Emit task update to creator + assignee only
   */
  const emitTaskUpdated = (
    creatorId: string,
    assignedToId: string | null,
    task: any
  ) => {
    io.to(creatorId).emit("task:updated", task);

    if (assignedToId) {
      io.to(assignedToId).emit("task:updated", task);
    }
  };

  /**
   * Emit assignment notification to assignee
   */
  const emitTaskAssigned = (
    assignedToUserId: string,
    task: any
  ) => {
    io.to(assignedToUserId).emit("task:assigned", {
      message: "You have been assigned a new task",
      task,
    });
  };

  return {
    emitTaskUpdated,
    emitTaskAssigned,
  };
};
