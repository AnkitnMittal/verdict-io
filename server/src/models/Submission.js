import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp', 'python', 'java', 'javascript'],
    },
    code: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      enum: ['Pending', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE'],
      default: 'Pending',
    },
    runtime: {
      type: Number,
      default: null,
    },
    memory: {
      type: Number,
      default: null,
    },
    aiReport: {
      type: String,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      expires: 90 * 24 * 60 * 60,
    },
  },
  { timestamps: true },
);

export const Submission = mongoose.model('Submission', submissionSchema);
