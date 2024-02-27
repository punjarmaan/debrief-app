import express from "express";
import { authenticateMiddleware } from "../middleware/auth";

const friendRoutes = express.Router()

// All friend-related CRUD ops must be authorized
friendRoutes.use(authenticateMiddleware)

export default friendRoutes