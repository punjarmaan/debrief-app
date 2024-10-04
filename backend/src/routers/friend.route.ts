import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { friendMiddleware } from "../middleware/friend";
import { getAllFriends, getFriendByUserId, getFriendByFriendshipId, deleteFriendByFriendshipId, deleteFriendByUserId } from "../controllers/friend.controller";

const friendRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRoutes.use(authenticateMiddleware)

// User-specific friend routes
friendRoutes.route("/").get(getAllFriends)
friendRoutes.route("/:friendship_id").get(getFriendByFriendshipId)
friendRoutes.route("/:friendship_id").delete(deleteFriendByFriendshipId)

// friend_id is verified before entering controller function
friendRoutes.route("/user/:friend_id").get(friendMiddleware, getFriendByUserId)
friendRoutes.route("/user/:friend_id").delete(friendMiddleware, deleteFriendByUserId)



export default friendRoutes