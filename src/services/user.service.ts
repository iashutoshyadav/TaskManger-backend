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
    throw new Error("Invalid user ID");
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  input: UpdateUserProfileInput
): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!input.name) {
    throw new Error("No valid fields to update");
  }

  const user = await updateUserById(userId, {
    name: input.name,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
