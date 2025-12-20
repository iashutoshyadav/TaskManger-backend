import { RegisterInput, LoginInput } from "../dtos/auth.dto";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { IUser } from "../models/user.model";

type AuthResponse = {
  user: Omit<IUser, "password">;
  token: string;
};

export const registerUser = async (
  input: RegisterInput
): Promise<AuthResponse> => {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  const token = signToken({ userId: user._id.toString() });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const loginUser = async (
  input: LoginInput
): Promise<AuthResponse> => {
  const user = await findUserByEmail(input.email, true);

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(input.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({ userId: user._id.toString() });

  // ✅ FIX: no toObject()
  const { password, ...safeUser } = user;

  return { user: safeUser as Omit<IUser, "password">, token };
};

