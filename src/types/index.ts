import mongoose from "mongoose";
import { Request } from "express";

export interface UserInputProps {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends UserInputProps, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
}

export interface UserPayload {
  _id: string;
  name: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: UserDocument;
}

// Task Interfaces

export interface TaskInputProps {
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface TaskDocument extends TaskInputProps, mongoose.Document {
  user: UserDocument["_id"];
  createdAt: Date;
  updatedAt: Date;
}
