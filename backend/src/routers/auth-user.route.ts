import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { getAllUsers, getUserById, updateProfile } from "../controllers/auth-user.controller";

const authUserRoutes = express.Router()

// All user-related update ops must be authorized
authUserRoutes.use(authenticateMiddleware)

authUserRoutes.route("/edit/:user_id").put(updateProfile)
authUserRoutes.route("/").get(getAllUsers)
authUserRoutes.route("/:user_id").get(getUserById)

export default authUserRoutes