import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { addFriend, getAllFriends, getFriendById, deleteFriendByFriendshipId, deleteFriendByUserId, acceptFriendByFriendshipId, acceptFriendByUserId } from "../controllers/friend.controller";

const friendRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRoutes.use(authenticateMiddleware)

// User-specific friend routes
friendRoutes.route("/").get(getAllFriends)
friendRoutes.route("/:friend_id").get(getFriendById)
friendRoutes.route("/:friend_id").put(acceptFriendByUserId)
friendRoutes.route("/:friend_id").delete(deleteFriendByUserId)
friendRoutes.route("/add/:friend_id").post(addFriend)
friendRoutes.route("/accept/:friendship_id").put(acceptFriendByFriendshipId)
friendRoutes.route("/delete/:friendship_id").delete(deleteFriendByFriendshipId)


export default friendRoutes