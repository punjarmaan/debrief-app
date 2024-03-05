import express from "express";
import { getAllEvents, createEvent, deleteEvent, updateEvent, uploadTest, addEventMember, getEventById, deleteEventMember } from "../controllers/event.controller";
import { authenticateMiddleware } from "../middleware/auth";

const eventRoutes = express.Router()

// All event-related CRUD ops must be authorized
eventRoutes.use(authenticateMiddleware)

//Individual event-related routes
eventRoutes.route("/").get(getAllEvents)
eventRoutes.route("/").post(createEvent)
eventRoutes.route("/:event_id").get(getEventById)
eventRoutes.route("/:event_id").delete(deleteEvent)
eventRoutes.route("/:event_id").put(updateEvent)

// Image upload to event routes
eventRoutes.route("/test").post(uploadTest)

// Member-event relationship routes
eventRoutes.route("/:event_id/members").put(addEventMember)
eventRoutes.route("/:event_id/members").delete(deleteEventMember)

export default eventRoutes