import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
    },
    passwordAttempts: {
      type: Number,
      default: 0,
    },
    passwordLocked: {
      type: Boolean,
      default: false,
    },
    postcode: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);
