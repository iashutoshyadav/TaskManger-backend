import { Server } from "socket.io";
import Client from "socket.io-client";
import http from "http";
import jwt from "jsonwebtoken";
import { initSocket } from "../src/config/socket";
import { env } from "../src/config/env";

let io: Server;
let server: http.Server;
let clientSocket: any;

const PORT = 7000;

const createToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret);

describe("Socket.io Task Events", () => {
  beforeAll((done) => {
    server = http.createServer();
    io = initSocket(server);
    server.listen(PORT, done);
  });

  afterAll((done) => {
    io.close();
    server.close(done);
  });

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${PORT}`, {
      auth: {
        token: createToken("user123"),
      },
    });
    clientSocket.on("connect", done);
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it("should receive task updated event", (done) => {
    clientSocket.on("task:updated", (task: any) => {
      expect(task.title).toBe("Test Task");
      done();
    });

    io.emit("task:updated", { title: "Test Task" });
  });

  it("should receive task assigned event", (done) => {
    clientSocket.on("task:assigned", (data: any) => {
      expect(data.message).toBeDefined();
      done();
    });

    io.to("user123").emit("task:assigned", {
      message: "You have been assigned a new task",
    });
  });
});
