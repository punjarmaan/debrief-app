import express from "express";

import { authenticateMiddleware } from "../middleware/auth";
import { addBoxMember, createBox, deleteBox, getAllBoxes, getBoxById, updateBox, deleteBoxMember, addExistingEvent } from "../controllers/box.controller";

const boxRoutes = express.Router()

boxRoutes.use(authenticateMiddleware)

//Individual event-related routes
boxRoutes.route("/").get(getAllBoxes)
boxRoutes.route("/").post(createBox)
boxRoutes.route("/:box_id").put(updateBox)

boxRoutes.route("/:box_id").get(getBoxById)
boxRoutes.route("/:box_id").delete(deleteBox)

boxRoutes.route("/:box_id/members/add").put(addBoxMember)
boxRoutes.route("/:box_id/members/delete").put(deleteBoxMember)

boxRoutes.route("/:box_id/add").put(addExistingEvent)
// boxRoutes.route("/:box_id/add/new").put(addNewEvent)


export default boxRoutes