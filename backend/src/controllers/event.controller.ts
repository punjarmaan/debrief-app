import { Request, Response } from "express";
import Event from "../models/event.model";
import { EventProfile } from "../types";
import { AuthRequest } from "../middleware/auth";
import User from "../models/user.model";
import { ObjectId } from "mongodb";
import { resourceLimits } from "worker_threads";


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

        if (!events) {
            return response.status(404).send("Error finding events.")
        }
        return response.status(200).send(events)
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
            return response.status(200).send(event)  
        } 
        
        return response.status(401).send("Event doesn't exist or unauthorized action.")
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
            creator_id: user,
            members: [user]
        })

        if (event) {
            return response.status(200).send(event)  
        }
        
        return response.status(401).send("Error creating event.")

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
            return response.status(404).send({ message: "Event does not exist." })
        } else if (!(eventToDelete.creator_id.toString() === user)) {
            return response.status(401).send({ message: "Unauthorized deletion: user does not own event "})
        }

        const result = await Event.deleteOne({
            _id: event_id
        })

        if (result.deletedCount == 1) {
            return response.status(204).send({ message: "Event deleted by creator."})
        }

        return response.send({ message: "Error deleting event."})


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

        const eventToUpdate = await Event.findById(event_id)
        const mem_exists = eventToUpdate.members.some(id => id.toString() == user)
        
        if (!eventToUpdate) {
            return response.status(404).send({ message: "Event does not exist." })
        } else if (!mem_exists) {
            return response.status(401).send({ message: "Unauthorized action: user does not belong to event." })
        }

        const result = await Event.updateOne({
            _id: event_id
        }, 
        {
         $set: {
            title
         }})

        if (result.modifiedCount == 1) {
            return response.send({ message: "Updated event successfully." })
        }
        
        return response.send({ message: "Error updating event." })
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
        const { event_id } = request.params
        const { new_mem_id } = request.body

        const new_mem_exists = await User.findById(new_mem_id)
        

        if (!new_mem_exists) {
            return response.send({ message: "Member doesn't exist" })
        }

        const result = await Event.updateOne({ 
                _id: event_id 
            },
            {
                $push: {
                    members: new_mem_id
                }
        })
        

        if (result.modifiedCount == 1) {
            return response.send({ message: "Member added successfully."})
        } 
        
        return response.send({ message: "Error adding member." })
    } catch (error) {
        console.log("error in addEventMember ", error)
        throw error
    }
}

export const deleteEventMember = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params
        const { del_mem_id } = request.body


        const event = await Event.findById(event_id)

        if (!event) {
            return response.status(404).send({ message: "Event does not exist." })
        } else if (!(event.creator_id.toString() === user)) {
            return response.status(401).send({ message: "Unauthorized deletion: user does not own event."})
        }

        const result = await Event.updateOne({ 
                _id: event_id,
            },
            {
                $pull: {
                    members: del_mem_id
                }
        })

        if (result.modifiedCount == 1) {
            return response.send({ message: "Member deleted successfully."})
        } 
        
        return response.send({ message: "Error deleting member" })
        
        return response.send(result)
    } catch (error) {
        console.log("error in deleteEventMember ", error)
        throw error
    }
}

// export const getAllEvents = async (request: AuthRequest, response: Response) => {
//     try {

//     } catch (error) {
//         console.log("error in getAllEvents ", error)
//         throw error
//     }
// }