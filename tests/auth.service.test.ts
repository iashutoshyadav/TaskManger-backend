import { registerUser } from "../src/services/auth.services";
import * as userRepo from "../src/repositories/user.repository";

jest.mock("../src/repositories/user.repository");

describe("Auth Service", () => {
  it("should register a new user successfully", async () => {
    (userRepo.findUserByEmail as jest.Mock).mockResolvedValue(null);
    (userRepo.createUser as jest.Mock).mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
    });

    const result = await registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBeDefined();
  });
});
