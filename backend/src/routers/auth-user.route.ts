import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { updateProfile } from "../controllers/auth-user.controller";

const authUserRoutes = express.Router()

// All user-related update ops must be authorized
authUserRoutes.use(authenticateMiddleware)

authUserRoutes.route("/edit/:id").put(updateProfile)

export default authUserRoutes