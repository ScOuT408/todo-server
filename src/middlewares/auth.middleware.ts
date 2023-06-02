import Jwt from "jsonwebtoken";
import { Response, NextFunction, RequestHandler } from "express";
import User from "../models/User";
import ErrorHandler from "../utils/error";
import { RequestWithUser, UserPayload } from "../types/index";
import { config } from "../utils/config";

export const isAuthenticated: RequestHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (
    !(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
  )
    return next(new ErrorHandler("Authorization token missing", 401));
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = Jwt.verify(token, config.JWT_SECRET) as UserPayload;

    const user = await User.findById({
      _id: (decoded as any).id,
    }).select("-password");

    if (!user) return next(new ErrorHandler("Unauthorized", 401));

    req.user = user;

    next();
  } catch (error: any) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
};
