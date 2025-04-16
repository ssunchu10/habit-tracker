// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuid} from 'uuid';

export interface IUser extends Document {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
}

const UserSchema: Schema = new Schema({
    id: {
      type: String,
      default: () => uuid(),
    },
    first_name: {
      type: String,
      required: [true, 'First Name is required']
    },
    last_name: {
        type: String,
        required: [true, 'Last Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password_hash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    last_login: {
      type: Date,
      default: Date.now
    }
  });

  export const User = mongoose.model<IUser>('User', UserSchema);