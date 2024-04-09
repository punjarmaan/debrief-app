import express from "express";
import { getAllEvents, createEvent, deleteEvent, updateEvent, uploadTest, addEventMember, getEventById, deleteEventMember } from "../controllers/event.controller";
import { authenticateMiddleware } from "../middleware/auth";
import { eventRequestMiddleware } from "../middleware/event";

const eventRoutes = express.Router()

// All event-related CRUD ops must be authorized
eventRoutes.use(authenticateMiddleware)

//Individual event-related routes
eventRoutes.route("/").get(getAllEvents)
eventRoutes.route("/").post(createEvent)
eventRoutes.route("/:event_id").get(eventRequestMiddleware, getEventById)
eventRoutes.route("/:event_id").delete(eventRequestMiddleware, deleteEvent)
eventRoutes.route("/:event_id").put(eventRequestMiddleware, updateEvent)

// Image upload to event routes
eventRoutes.route("/test").post(uploadTest)

// Member-event relationship routes
eventRoutes.route("/:event_id/members/add").put(eventRequestMiddleware, addEventMember)
eventRoutes.route("/:event_id/members/del").delete(eventRequestMiddleware,deleteEventMember)

export default eventRoutes