import mongoose from 'mongoose';
import zlib from 'zlib';
import { promisify } from 'util';

/* Promisify zlib methods for async/await usage */
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

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
      type: Buffer,
      required: true,
    },
    verdict: {
      type: String,
      enum: ['Pending', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE'],
      default: 'Pending',
    },
    runtime: {
      type: Number,
    },
    memory: {
      type: Number,
    },
    aiReport: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      expires: '90d',
    },
  },
  { timestamps: true },
);

/* Pre-save hook to compress the code before saving to the database */
submissionSchema.pre('save', async function () {
  if (this.isModified('code')) {
    const raw = Buffer.isBuffer(this.code) ? this.code : Buffer.from(this.code, 'utf8');
    this.code = await deflate(raw);
  }
});

/* Middleware for findOneAndUpdate to compress code */
submissionSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  const rawCode = update.code ?? update.$set?.code;
  if (rawCode !== undefined && !Buffer.isBuffer(rawCode)) {
    const compressed = await deflate(Buffer.from(rawCode, 'utf8'));
    if (update.$set) {
      update.$set.code = compressed;
    } else {
      update.code = compressed;
    }
  }
});

/* Method to get the decoded code */
submissionSchema.methods.getDecodedCode = async function () {
  const buf = await inflate(this.code);
  return buf.toString('utf8');
};

export const Submission = mongoose.model('Submission', submissionSchema);
