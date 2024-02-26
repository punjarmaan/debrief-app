import express, { Request, Response, application } from 'express'
import connectToDB from './db'
import userRoutes from './routers/user.route';
import eventRoutes from './routers/event.route'
import authUserRoutes from './routers/auth-user.route'

const app = express()
app.use(express.json())

const PORT = 8080

connectToDB();

app.get("/", (request: Request, response: Response) => {
    response.send("Pong")
})

// All Backend Routes
app.use("/api/user", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/auth-user", authUserRoutes)

app.listen(PORT, () => {
    console.log(PORT + " is listening!")
})