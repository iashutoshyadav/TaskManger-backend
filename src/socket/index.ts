import { Server } from "socket.io";
import { registerTaskSocket } from "./task.scoket";

export const registerSocketHandlers = (io: Server): void => {
  registerTaskSocket(io);
};
