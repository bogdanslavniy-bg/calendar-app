import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const getTasks = async (_req: Request, res: Response) => {
    const tasks = await Task.find();
    res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
    const task = await Task.create(req.body);
    res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};