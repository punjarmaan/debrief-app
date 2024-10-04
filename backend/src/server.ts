import express, { Request, Response, application } from 'express'
import { connectToDB } from './db'
import userRoutes from './routers/user.route';
import eventRoutes from './routers/event.route'
import authUserRoutes from './routers/auth-user.route'
import friendRoutes from './routers/friend.route';
import boxRoutes from './routers/box.route';
import friendRequestRoutes from './routers/friend-request.route';

const app = express()
app.use(express.json())

const PORT = 8080

connectToDB();

app.get("/", (request: Request, response: Response) => {
    response.send({ message: "Pong" })
})

// All Backend Routes
app.use("/api/user", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/auth-user", authUserRoutes)
app.use("/api/friends", friendRoutes)
app.use("/api/box", boxRoutes)
app.use("/api/reqs", friendRequestRoutes)

// Comment out code below when testing with jest
if (process.env.NODE_ENV == 'LOCAL') {
    app.listen(PORT, () => {
        console.log(PORT + " is listening!")
    })
}


export default app