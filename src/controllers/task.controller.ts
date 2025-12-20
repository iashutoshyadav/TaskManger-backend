import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import * as taskService from "../services/task.service";

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = CreateTaskDto.parse(req.body);
    const task = await taskService.createNewTask(data, req.userId!);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};


export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("UPDATE BODY:", req.body); 
    const data = UpdateTaskDto.parse(req.body);
    const task = await taskService.updateTask(
      req.params.id,
      data,
      req.userId!
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await taskService.deleteTask(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await taskService.fetchTasks({
      userId: req.userId!,
      status: req.query.status as any,
      priority: req.query.priority as any,
      page,
      limit,
    });

    res.json({
      data: result.tasks,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

