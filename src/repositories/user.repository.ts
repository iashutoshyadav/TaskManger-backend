import { UserModel, IUser } from "../models/user.model";

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async (
  data: CreateUserData
): Promise<IUser> => {
  return UserModel.create(data);
};

export const findUserByEmail = async (
  email: string,
  withPassword = false
): Promise<IUser | null> => {
  const query = UserModel.findOne({ email });
  if (withPassword) {
    query.select("+password");
  }
  return query.exec();
};

export const findUserById = async (
  id: string
): Promise<IUser | null> => {
  return UserModel.findById(id).exec();
};

type UpdateUserData = {
  name?: string;
};

export const updateUserById = async (
  id: string,
  data: UpdateUserData
): Promise<IUser | null> => {
  return UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};
