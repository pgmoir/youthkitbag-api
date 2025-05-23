import * as mongoose from 'mongoose';
import { KitbagStates } from '../../enums/kitbagStates.enum';

export const KitbagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Kitbag name is required'],
    },
    space: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    activitys: [
      {
        type: String,
        lowercase: true,
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    state: {
      type: String,
      enum: [
        KitbagStates.ACTIVE,
        KitbagStates.BLOCKED,
        KitbagStates.DELETED,
        KitbagStates.REQUESTED,
      ],
      required: true,
      default: KitbagStates.ACTIVE,
    },
  },
  { timestamps: true },
);
