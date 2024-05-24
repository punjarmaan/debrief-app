import express from "express";
import { getAllEvents, getLockedEvents, getOpenEvents, createEvent, deleteEvent, updateEvent, uploadTest, addEventMember, getEventById, deleteEventMember, leaveEvent } from "../controllers/event.controller";
import { authenticateMiddleware } from "../middleware/auth";
import { eventCreatorMiddleware, eventRequestMiddleware } from "../middleware/event";

const eventRoutes = express.Router()

// All event-related CRUD ops must be authorized
eventRoutes.use(authenticateMiddleware)

// Individual event-related routes
eventRoutes.route("/").get(getAllEvents)
eventRoutes.route("/").get(getLockedEvents)
eventRoutes.route("/").get(getOpenEvents)
eventRoutes.route("/").post(createEvent)
eventRoutes.route("/:event_id").get(eventRequestMiddleware, getEventById)
eventRoutes.route("/:event_id").delete(eventRequestMiddleware, eventCreatorMiddleware, deleteEvent)
eventRoutes.route("/:event_id").put(eventRequestMiddleware, updateEvent)
eventRoutes.route("/:event_id/leave").put(eventRequestMiddleware, leaveEvent)

// Image upload to event routes
eventRoutes.route("/test").post(uploadTest)

// Member-event relationship routes
eventRoutes.route("/:event_id/members/add").put(eventRequestMiddleware, addEventMember)
eventRoutes.route("/:event_id/members/del").put(eventRequestMiddleware, eventCreatorMiddleware, deleteEventMember)

export default eventRoutes