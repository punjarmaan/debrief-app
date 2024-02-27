import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { getAllFriends, getFriendById } from "../controllers/friend.controller";

const friendRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRoutes.use(authenticateMiddleware)

// User-specific friend routes
friendRoutes.route("/").get(getAllFriends)
friendRoutes.route("/:friend_id").get(getFriendById)

export default friendRoutes