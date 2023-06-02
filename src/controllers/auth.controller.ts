import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/User";
import ErrorHandler from "../utils/error";
import { RequestWithUser } from "../types/index";

//  * @desc    register a new user
//  * @route   POST /api/auth/register

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    const isUserExists = await User.findOne({ email });

    if (isUserExists) return next(new ErrorHandler("User already exists", 400));

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//  * @desc    login user
//  * @route   POST /api/auth/login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid credentials", 401));

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

//  * @desc    get the user
//  * @route   POST /api/auth/me

export const getMyProfile: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as any;

  try {
    const user = await User.findById(_id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};
