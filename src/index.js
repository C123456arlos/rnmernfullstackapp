import express from 'express'
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import { connectDB } from './lib/db.js'
import cors from 'cors'
import dns from "node:dns/promises"
dns.setServers(["1.1.1.1"])
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())
app.use('/api/auth', authRoutes)
app.use('/api/book', bookRoutes)
app.listen(3000, () => {
    console.log(`server is running on port ${PORT}`)
    connectDB()
})