import mongoose from "mongoose";
import { UpdateUserProfileInput } from "../dtos/user.dto";
import {
  updateUserById,
  findUserById,
} from "../repositories/user.repository";
import { IUser } from "../models/user.model";

export const getProfile = async (
  userId: string
): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err: any = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  const user = await findUserById(userId);
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  input: UpdateUserProfileInput
): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err: any = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  if (!input.name) {
    const err: any = new Error("No fields to update");
    err.status = 400;
    throw err;
  }

  const user = await updateUserById(userId, {
    name: input.name,
  });

  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return user;
};
