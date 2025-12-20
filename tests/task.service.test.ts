import * as taskRepo from "../src/repositories/task.repository";
import { createNewTask } from "../src/services/task.service";

jest.mock("../src/repositories/task.repository");
jest.mock("../src/config/socket", () => ({
  getIO: () => ({
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  }),
}));

describe("Task Service", () => {
  it("should not allow past due dates", async () => {
    await expect(
      createNewTask(
        {
          title: "Test Task",
          dueDate: new Date("2000-01-01"),
          priority: "LOW" as any,
          assignedToId: "user123" as any,
        },
        "creator123"
      )
    ).rejects.toThrow("Due date cannot be in the past");
  });

  it("should create task successfully", async () => {
    (taskRepo.createTask as jest.Mock).mockResolvedValue({
      title: "Test Task",
    });

    const task = await createNewTask(
      {
        title: "Test Task",
        dueDate: new Date(Date.now() + 86400000),
        priority: "LOW" as any,
        assignedToId: "user123" as any,
      },
      "creator123"
    );

    expect(task).toBeDefined();
  });
});
