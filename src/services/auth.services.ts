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
  const existing = await findUserByEmail(input.email);
  if (existing) {
    const err: any = new Error("Email already exists");
    err.status = 409;
    throw err;
  }

  const hashed = await hashPassword(input.password);
  const user = await createUser({ ...input, password: hashed });

  const token = signToken(user._id.toString());

  const obj = user.toObject();
  delete obj.password;

  return { user: obj, token };
};

export const loginUser = async (
  input: LoginInput
): Promise<AuthResponse> => {
  const user = await findUserByEmail(input.email, true);
  if (!user || !user.password) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await comparePassword(input.password, user.password);
  if (!ok) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken(user._id.toString());
  const obj = user.toObject();
  delete obj.password;

  return { user: obj, token };
};
