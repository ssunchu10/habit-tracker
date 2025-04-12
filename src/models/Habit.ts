// src/models/Habit.ts
import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IHabit extends Document {
  id: string;
  user_id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  days_of_week: string[];
  start_date: Date;
  end_date?: Date;
  is_active: boolean;
  reminder_time?: Date;
  created_at: Date;
}

const HabitSchema: Schema = new Schema({
  id: {
    type: String,
    default: () => uuid()
  },
  user_id: {
    type: String,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    default: ''
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    required: [true, 'Frequency is required']
  },
  days_of_week: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  start_date: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end_date: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  reminder_time: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IHabit>('Habit', HabitSchema);