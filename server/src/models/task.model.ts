import { Schema, model } from "mongoose";
import { ITask } from "../types/task.types";

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Task = model<ITask>("Task", TaskSchema);