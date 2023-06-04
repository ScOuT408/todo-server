import { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "../utils/error";
import Task from "../models/Task";
import { RequestWithUser } from "../types/index";
import User from "../models/User";

//  * @desc    get all tasks
//  * @route   GET /api/tasks/

export const getTasks: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({ user: req.user?._id });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//  * @desc    create a task
//  * @route   GET /api/tasks/add

export const addTask: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.user?._id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    const newTask = await Task.create({
      title,
      description,
      user: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//  * @desc    update a task
//  * @route   GET /api/tasks/:id

export const updateTask: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user?._id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    const task = await Task.findById(id);
    if (!task) return next(new ErrorHandler("Task not found", 404));

    if (task.user.toString() !== req.user?._id.toString()) {
      return next(new ErrorHandler("You are not allowed", 401));
    }

    await Task.findByIdAndUpdate(
      id,
      {
        isCompleted: !task.isCompleted,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//  * @desc    delete a task
//  * @route   GET /api/tasks/:id

export const deleteTask: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user?._id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    const task = await Task.findById(id);
    if (!task) return next(new ErrorHandler("Task not found", 404));

    if (task.user.toString() !== req.user?._id.toString()) {
      return next(new ErrorHandler("You are not allowed", 401));
    }
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};
