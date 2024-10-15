import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { userMiddleware } from "../middleware/user";
import { getAllReceivedRequests, getAllSentRequests, getRequestById, getRequestByUserId, addFriendByUserId, acceptReqById, acceptReqByUserId, rejectReqById, rejectReqByUserId, unsendReqById, unsendReqByUserId } from "../controllers/friend-request.controller";

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
friendRequestRoutes.route("/del/:request_id").delete(unsendReqById)

// User-specific friend request routes (by friend/user id)
// friend_id is verified before entering controller function
friendRequestRoutes.route("/user/:friend_id").get(userMiddleware, getRequestByUserId)
friendRequestRoutes.route("/add/:friend_id").post(userMiddleware, addFriendByUserId)
friendRequestRoutes.route("/accept/:friend_id").post(userMiddleware, acceptReqByUserId)
friendRequestRoutes.route("/reject/:friend_id").delete(userMiddleware, rejectReqByUserId)
friendRequestRoutes.route("/del/user/:friend_id").delete(userMiddleware, unsendReqByUserId)


export default friendRequestRoutes