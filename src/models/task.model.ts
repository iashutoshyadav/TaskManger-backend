import mongoose, { Document, Schema } from "mongoose";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED",
}

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: mongoose.Types.ObjectId;
  assignedToId: mongoose.Types.ObjectId | null ;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: String,
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default:null,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

/** Performance indexes */
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ status: 1, priority: 1 });
TaskSchema.index({ assignedToId: 1, status: 1 });

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
