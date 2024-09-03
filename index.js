import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes, { authMiddleware } from "./routes/auth.js"
import taskRoutes from "./routes/tasks.js"

const PORT = process.env.PORT || 5000
const MONGODB_CONN = process.env.MONGODB_CONN

const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// connect to MongoDB
mongoose.connect(MONGODB_CONN).then(() => {
    console.log("Connected to MongoDB")
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", authMiddleware, taskRoutes)

// protected test route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.userId}!` })
})

// test route
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API is running!' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})