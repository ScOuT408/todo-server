import { NextFunction, Request, Response } from "express";

export const errorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Something went wrong";
  err.statusCode = err.statusCode || 500;

  if (err.statusCode === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    err.message = `Invalid ${err.path}`;
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({ success: false, message: err.message });
};
