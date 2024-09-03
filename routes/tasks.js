import express from "express"
import Task from "../models/Task.js"

const router = express.Router()

// GET /api/tasks
router.get("/", async (req, res) => {
    const user = req.user
    const tasks = await Task.find({ assignedTo: user._id })
    res.json({
        message: "Tasks retrieved successfully",
        data: {
            tasks: tasks,
        }
    })
})

// POST /api/tasks
router.post("/", async (req, res) => {
    const user = req.user
    const { title, description, dueDate } = req.body
    const task = new Task({
        title,
        description,
        dueDate,
        assignedTo: user._id,
    })
    await task.save()
    res.status(201).json({
        message: "Task created successfully",
        data: {
            task: task,
        }
    })
})

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
    const user = req.user
    const { id } = req.params
    const task = await Task.findOne({ _id: id, assignedTo: user._id })
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }
    res.json({
        message: "Task retrieved successfully",
        data: {
            task: task,
        }
    })
})

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
    const user = req.user
    const { id } = req.params
    const { title, description, dueDate } = req.body
    const task = await Task.findOne({ _id: id, assignedTo: user._id })
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }
    task.title = title
    task.description = description
    task.dueDate = dueDate
    await task.save()
    res.json({
        message: "Task updated successfully",
        data: {
            task: task,
        }
    })
})

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    const user = req.user
    const { id } = req.params
    const task = await Task.findOne({ _id: id, assignedTo: user._id })
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }
    await task.deleteOne()
    res.json({ message: "Task deleted successfully" })
})

export default router