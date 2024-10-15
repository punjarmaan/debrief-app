import { Response } from "express";
import Box from "../models/box.model";
import { BoxProfile, EventProfile } from "../types";
import { BoxRole } from "../types/box.enum";
import { AuthBoxRequest } from "../middleware/box";
import User from "../models/user.model";
import Event from "../models/event.model"
import mongoose from "mongoose";
import idValidation from "../middleware/id";

export const getAllBoxes = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const boxes = await Box.find({
            members: user
        })
        .select('-__v')
        .populate({
            path: 'events',
            select: 'title creator_id images members createdAt'
        })
        .sort({
            updatedAt: -1
        })

        return response.status(200).send(boxes)
    } catch (error) {
        console.log("error in getAllBoxes\n", error)
        throw error
    }
}

export const getBoxById = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params

        const box = await Box.findById({
            _id: box_id
        }).populate({
            path: 'events',
            select: 'title creator_id images members createdAt'
        })

        return response.status(200).send(box)  

    } catch (error) {
        console.log("error in getBoxById ", error)
        throw error
    }
}

export const createBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { title, is_private }: BoxProfile = request.body

        if (!title || !is_private) {
            return response.status(400).send({ message: "Invalid Request: missing parameters." })
        }

        const { user } = request
        
        const box = await Box.create({
            title: title,
            creator_id: user,
            members: [user],
            private: is_private
        })

        return response.status(200).send(box)  

    } catch (error) {
        console.log("error in createBox ", error)
    }
}

export const deleteBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { box_id } = request.params
        const { user } = request


        const result = await Box.deleteOne({
            _id: box_id
        })

        return response.status(200).send({ message: "Box deleted by creator."})

    } catch (error) {
        console.log("error in deleteBox ", error)
        throw error
    }
}

export const updateBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { title, is_private}: BoxProfile = request.body
        const { box_id } = request.params
        const { user } = request
        
        const result = await Box.updateOne({
            _id: box_id
        }, 
        {
         $set: {
            title,
            private: is_private
         }})
        
         return response.status(200).send({ message: "Updated box successfully." })
    } catch (error) {
        console.log("error in updatebox ", error)
        throw error
    }
}

export const addBoxMember = async (request: AuthBoxRequest, response: Response) => {
    try {

        const { user, role } = request
        const { box_id, mem_id } = request.params
        const is_private = await (await Box.findById(box_id)).private

        if (is_private && role != BoxRole.CREATOR) {
            return response.status(401).send({ message: "Unauthorized action by a member: box is private." })
        }
        
        const result = await Box.updateOne(
            { 
                _id: box_id
            },
            {
                $push: {
                    members: mem_id
                }
        })
        

        return response.status(200).send({ message: "Member added successfully."})

    } catch (error) {
        console.log("error in addboxMember ", error)
        throw error
    }
}

export const deleteBoxMember = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user, role } = request
        const { box_id, mem_id } = request.params
        const is_private = await (await Box.findById(box_id)).private

        if (is_private && role != BoxRole.CREATOR) {
            return response.status(401).send({ message: "Unauthorized action by a member: box is private." })
        }
        
        const result = await Box.updateOne({ 
                _id: box_id,
            },
            {
                $pull: {
                    members: mem_id
                }
        })

        return response.status(200).send({ message: "Member deleted successfully."})
    } catch (error) {
        console.log("error in deleteboxMember", error)
        throw error
    }
}

export const addExistingEvent = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id, event_id } = request.params

        const event_exists = await idValidation(event_id, Event)
        
        if (!event_exists) { return response.status(404).send({ message: "Event doesn't exist." }) }

        if (event_exists.creator_id != user) { return response.status(401).send({ message: "Unauthorized action: User does not own event." }) }

        const result = await Box.updateOne({
            _id: box_id
        },
            {
                $push: {
                    events: event_id
                }
        })
        

        return response.status(200).send({ message: "Event added to box successfully."})
        
    } catch (error) {
        console.log("error in addExistingEvent ", error)
        throw error
    }
}

export const leaveBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params
        const { role } = request

        if (role == BoxRole.CREATOR) {
            return response.status(401).send({ message: "Creator cannot leave their own box." })
        }

        const result = await Box.updateOne({ 
            _id: box_id,
        },
        {
            $pull: {
                members: user
            }
        })

        return response.status(200).send({ message: "Left box successfully." })

    } catch (error) {
        console.log("error in leaveBox ", error)
        throw error
    }
}


export const addNewEvent = async (request: AuthBoxRequest, response: Response) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();

        const { user } = request
        const { box_id } = request.params
        const { title }: EventProfile = request.body

        if (!title) {
            await session.abortTransaction();
            return response.status(400).send({ message: "Event title is required." })
        }

        const event = await Event.create([{
            title: title,
            creator_id: user,
            members: [user]
        }], {
            session
        })

        if (!event[0]) {
            await session.abortTransaction();
            return response.send({ message: "Error while creating event"})
        }

        const result = await Box.updateOne(
            {
                _id: box_id
            },
            {
                $push: {
                    events: event[0]._id
                }
        },
        {
            session
        })
        

        if (!result || result.modifiedCount != 1) {
            await session.abortTransaction();
            return response.send({ message: "Error while adding event to box."})
        } 


        await session.commitTransaction();
        return response.status(200).send({ message: "New event added successfully." })

    } catch (error) {
        await session.abortTransaction();
        console.log("error in addNewEvent\n", error)
    } finally {
        await session.endSession();
    }
}