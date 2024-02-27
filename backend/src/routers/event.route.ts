import express from "express";
import { getAllEvents, createEvent, deleteEvent, updateEvent, uploadTest, addEventMember, getEventById } from "../controllers/event.controller";
import { authenticateMiddleware } from "../middleware/auth";

const eventRoutes = express.Router()

// All event-related CRUD ops must be authorized
eventRoutes.use(authenticateMiddleware)

eventRoutes.route("/").get(getAllEvents)
eventRoutes.route("/:id").get(getEventById)
eventRoutes.route("/create").post(createEvent)
eventRoutes.route("/delete/:id").delete(deleteEvent)
eventRoutes.route("/update").put(updateEvent)
eventRoutes.route("/test").post(uploadTest)
eventRoutes.route("/:id/add").put(addEventMember)

export default eventRoutes