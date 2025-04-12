// src/models/HabitLog.ts
import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IHabitLog extends Document {
  _id: string;
  habit_id: string;
  date: Date;
  completed: boolean;
  note?: string;
  logged_at: Date;
}

const HabitLogSchema: Schema = new Schema({
  _id: {
    type: String,
    default: () => uuid()
  },
  habit_id: {
    type: String,
    ref: 'Habit',
    required: [true, 'Habit ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: null
  },
  logged_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IHabitLog>('HabitLog', HabitLogSchema);