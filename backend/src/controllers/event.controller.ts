import { Request, Response } from "express";
import Event from "../models/event.model";
import { EventProfile } from "../types";
import { AuthRequest } from "../middleware/auth";

export const getAllEvents = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const events = await Event.find({
            $or: [{
                creator_id: user
            }, {
                members: user
            }]
        })
        response.status(200).send(events)
    } catch (error) {
        console.log("error in getAllEvents ", error)
        throw error
    }
}

export const getEventById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params

        const event = await Event.find({
            $and: [{
                 _id: event_id 
            }, {
                $or: [
                    { creator_id: user},
                    { members: user }
                ]
            }]
        })

        if (event) {
            response.status(200).send(event)  
        } else {
            response.status(401).send("Event doesn't exist or unauthorized action.")
        }
    } catch (error) {
        console.log("error in getEventById ", error)
        throw error
    }
}

export const createEvent = async (request: AuthRequest, response: Response) => {
    try {
        const { title }: EventProfile = request.body
        const { user } = request
        
        const event = await Event.create({
            title: title,
            creator_id: user
        })

        response.send(event)
    } catch (error) {
        console.log("error in createEvent ", error)
        throw error
    }
}

export const deleteEvent = async (request: AuthRequest, response: Response) => {
    try {
        const { event_id } = request.params
        const { user } = request

        const eventToDelete = await Event.findById(event_id)

        if (!eventToDelete) {
            response.status(404).send({ message: "Event does not exist." })
        } else if (!(eventToDelete.creator_id.toString() === user)) {
            response.status(401).send({ message: "Unauthorized deletion: user does not own event "})
        }

        await Event.deleteOne({
            _id: event_id
        })
        response.status(204).send({ message: "Event deleted by creator."})
    } catch (error) {
        console.log("error in getAllEvents ", error)
        throw error
    }
}

export const updateEvent = async (request: AuthRequest, response: Response) => {
    try {
        const { title }: EventProfile = request.body
        const { event_id } = request.params
        const { user } = request

        await Event.updateOne({
            _id: event_id
        }, 
        {
         $set: {
            title
         }})
        response.send({ message: "Event updated successfully."}) 
    } catch (error) {
        console.log("error in updateEvent ", error)
        throw error
    }
}

export const uploadTest = async (request: AuthRequest, response: Response) => {
    try {
        console.log("request.body", request.body.title)
        console.log("request.body.binary", request.body.binary)
        response.send({ message: "img uploaded" })
    } catch (error) {
        console.log("error in uploadTest ", error)
        throw error
    }
}

export const addEventMember = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { id } = request.params
        const { new_mem_id } = request.body

        await Event.updateOne(
            { 
                _id: id 
            },
            {
                $push: {
                    members: new_mem_id
                }
        })
        
        response.send({ message: "New event member added: ", new_mem_id })
    } catch (error) {
        console.log("error in addEventMember ", error)
        throw error
    }
}

export const deleteEventMember = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { id } = request.params
        const { del_mem_id } = request.body

        await Event.updateOne(
            { 
                _id: id 
            },
            {
                $pop: {
                    members: del_mem_id
                }
        })
        
        response.send({ message: "Event member removed: ", del_mem_id })
    } catch (error) {
        console.log("error in deleteEventMember ", error)
        throw error
    }
}

// const getAllEvents = async (request: AuthRequest, response: Response) => {
//     try {

//     } catch (error) {
//         console.log("error in getAllEvents ", error)
//         throw error
//     }
// }