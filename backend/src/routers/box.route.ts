import express from "express";
import { authenticateMiddleware } from "../middleware/auth";
import { boxRequestMiddleware, boxCreatorMiddleware } from "../middleware/box";
import { addBoxMember, createBox, deleteBox, getAllBoxes, getBoxById, updateBox, deleteBoxMember, addExistingEvent, leaveBox } from "../controllers/box.controller";

const boxRoutes = express.Router()

boxRoutes.use(authenticateMiddleware)

//Individual event-related routes
boxRoutes.route("/").get(getAllBoxes)
boxRoutes.route("/").post(createBox)
boxRoutes.route("/:box_id").put(boxRequestMiddleware, updateBox)

boxRoutes.route("/:box_id").get(boxRequestMiddleware, getBoxById)
boxRoutes.route("/:box_id").delete(boxRequestMiddleware, boxCreatorMiddleware, deleteBox)
boxRoutes.route("/:box_id/add").put(boxRequestMiddleware, addExistingEvent)
boxRoutes.route("/:box_id/leave").put(boxRequestMiddleware, leaveBox)

boxRoutes.route("/:box_id/members/add").put(boxRequestMiddleware, addBoxMember)
boxRoutes.route("/:box_id/members/del").put(boxRequestMiddleware, boxCreatorMiddleware, deleteBoxMember)



// boxRoutes.route("/:box_id/add/new").put(addNewEvent)


export default boxRoutes