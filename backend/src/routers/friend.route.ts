import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { userMiddleware } from "../middleware/user";
import { getAllFriends, getFriendByUserId, getFriendByFriendshipId, deleteFriendByFriendshipId, deleteFriendByUserId } from "../controllers/friend.controller";

const friendRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRoutes.use(authenticateMiddleware)

// User-specific friend routes
friendRoutes.route("/").get(getAllFriends)
friendRoutes.route("/:friendship_id").get(getFriendByFriendshipId)
friendRoutes.route("/:friendship_id").delete(deleteFriendByFriendshipId)

// friend_id is verified before entering controller function
friendRoutes.route("/user/:mem_id").get(userMiddleware, getFriendByUserId)
friendRoutes.route("/user/:mem_id").delete(userMiddleware, deleteFriendByUserId)



export default friendRoutes