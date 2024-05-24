import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { friendMiddleware } from "../middleware/friend";
import { getAllReceivedRequests, getAllSentRequests, getRequestById, getRequestByUserId, addFriendByUserId, acceptReqById, acceptReqByUserId, rejectReqById, rejectReqByUserId, deleteReqById, deleteReqByUserId } from "../controllers/friend-request.controller";

const friendRequestRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRequestRoutes.use(authenticateMiddleware)

// User-specific friend request routes
friendRequestRoutes.route("/").get(getAllReceivedRequests)
friendRequestRoutes.route("/sent").get(getAllSentRequests)

// User-specific friend request routes (by request id)
friendRequestRoutes.route("/:request_id").get(getRequestById)
friendRequestRoutes.route("/:request_id").post(acceptReqById)
friendRequestRoutes.route("/:request_id").delete(rejectReqById)
friendRequestRoutes.route("/del/:request_id").delete(deleteReqById)

// User-specific friend request routes (by friend/user id)
// friend_id is verified before entering controller function
friendRequestRoutes.route("/user/:friend_id").get(friendMiddleware, getRequestByUserId)
friendRequestRoutes.route("/add/:friend_id").post(friendMiddleware, addFriendByUserId)
friendRequestRoutes.route("/accept/:friend_id").post(friendMiddleware, acceptReqByUserId)
friendRequestRoutes.route("/reject/:friend_id").delete(friendMiddleware, deleteReqByUserId)
friendRequestRoutes.route("/del/:friend_id").delete(friendMiddleware, deleteReqByUserId)


export default friendRequestRoutes