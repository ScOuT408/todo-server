import { Model, Schema, model, models } from "mongoose";
import { UserDocument } from "../types/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);

  this.password = hashPassword;

  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  const user = this as UserDocument;

  return bcrypt.compare(password, user.password).catch((e) => false);
};

userSchema.methods.generateToken = function () {
  const user = this as UserDocument;

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

const User = models.User || model("User", userSchema);

export default User as Model<UserDocument>;
