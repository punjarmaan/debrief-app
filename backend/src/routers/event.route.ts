import express from "express";
import { getAllEvents, getLockedEvents, getUnlockedEvents, createEvent, deleteEvent, updateEvent, unlockEvent, addEventMember, getEventById, deleteEventMember, leaveEvent } from "../controllers/event.controller";
import { authenticateMiddleware } from "../middleware/auth";
import { eventCreatorMiddleware, eventRequestMiddleware } from "../middleware/event";
import { userMiddleware } from "../middleware/user";

const eventRoutes = express.Router()

// All event-related CRUD ops must be authorized
eventRoutes.use(authenticateMiddleware)

// Individual event-related routes
eventRoutes.route("/").get(getAllEvents)
eventRoutes.route("/").post(createEvent)
eventRoutes.route("/locked").get(getLockedEvents)
eventRoutes.route("/unlocked").get(getUnlockedEvents)
eventRoutes.route("/:event_id").get(eventRequestMiddleware, getEventById)
eventRoutes.route("/:event_id").delete(eventRequestMiddleware, eventCreatorMiddleware, deleteEvent)
eventRoutes.route("/:event_id").put(eventRequestMiddleware, updateEvent)
eventRoutes.route("/:event_id/unlock").put(eventRequestMiddleware, eventCreatorMiddleware, unlockEvent)
eventRoutes.route("/:event_id/leave").put(eventRequestMiddleware, leaveEvent)

// Image upload to event routes
// eventRoutes.route("/test").post(uploadTest)

// Member-event relationship routes
eventRoutes.route("/:event_id/members/add/:mem_id").put(eventRequestMiddleware, userMiddleware, addEventMember)
eventRoutes.route("/:event_id/members/del/:mem_id").put(eventRequestMiddleware, eventCreatorMiddleware, userMiddleware, deleteEventMember)

export default eventRoutes