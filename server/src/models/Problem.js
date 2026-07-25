import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: [true, 'Problem ID is required'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    statement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    timeLimit: {
      type: Number,
      default: 2,
    },
    memoryLimit: {
      type: Number,
      default: 256,
    },
    skeletonCode: [
      {
        language: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Problem = mongoose.model('Problem', problemSchema);
