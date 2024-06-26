import { Response } from "express";
import Event from "../models/event.model";
import { EventProfile } from "../types";
import { AuthEventRequest } from "../middleware/event";
import User from "../models/user.model";
import { EventRole } from "../types/event.enum";


export const getAllEvents = async (request: AuthEventRequest, response: Response) => {
    try {
        const { user } = request
        const events = await Event.find({
            members: user
        }).select('-createdAt -updatedAt -__v')

        if (!events) {
            return response.status(404).send("Error finding events.")
        }
        return response.status(200).send(events)
    } catch (error) {
        console.log("error in getAllEvents ", error)
        throw error
    }
}

export const getEventById = async (request: AuthEventRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params


        const event = await Event.findById({
            _id: event_id
        }).populate({
            path: 'creator_id',
            select: 'username firstName lastName _id'
        }).populate({
            path: 'members',
            select: 'username firstName lastName _id'
        }).select('-createdAt -updatedAt -__v')

        return response.status(200).send(event)
    } catch (error) {
        console.log("error in getEventById ", error)
        throw error
    }
}

export const createEvent = async (request: AuthEventRequest, response: Response) => {
    try {
        const { title }: EventProfile = request.body
        const { user } = request

        if (!title) {
            return response.status(400).send({ message: "Event title is required." })
        }
        
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

export const deleteEvent = async (request: AuthEventRequest, response: Response) => {
    try {
        const { event_id } = request.params
        const { user } = request
        const { role } = request

        if (role == EventRole.CREATOR) {
            const result = await Event.deleteOne({
                _id: event_id
            })

            if (result.deletedCount == 1) {
                return response.status(200).send({ message: "Event deleted by creator."})
            }

        } else if (role == EventRole.MEMBER) {
            return response.status(401).send({ message: "Unauthorized action: user does not own event." })
        }

        return response.status(401).send({ message: "Error deleting event." })

    } catch (error) {
        console.log("error in deleteEvent ", error)
        throw error
    }
}

export const updateEvent = async (request: AuthEventRequest, response: Response) => {
    try {
        const { title }: EventProfile = request.body
        const { event_id } = request.params
        const { user } = request
        const { role } = request

        const result = await Event.updateOne({
            _id: event_id
        }, 
        {
        $set: {
            title
        }})
    
        if (result.modifiedCount == 1) {
            return response.status(200).send({ message: "Updated event successfully." })
        }

        return response.send({ message: "Error updating event." })
    } catch (error) {
        console.log("error in updateEvent ", error)
        throw error
    }
}

export const uploadTest = async (request: AuthEventRequest, response: Response) => {
    try {
        console.log("request.body", request.body.title)
        console.log("request.body.binary", request.body.binary)
        response.send({ message: "img uploaded" })
    } catch (error) {
        console.log("error in uploadTest ", error)
        throw error
    }
}

export const addEventMember = async (request: AuthEventRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params
        const { new_mem_id } = request.body

        const new_mem_exists = await User.findById(new_mem_id)

        if (!new_mem_exists) {
            return response.status(404).send({ message: "Member doesn't exist." })
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
            return response.status(200).send({ message: "Member added successfully." })
        }
        
    } catch (error) {
        console.log("error in addEventMember ", error)
        throw error
    }
}

export const deleteEventMember = async (request: AuthEventRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params
        const { del_mem_id } = request.body
        const { role } = request


        if (role != EventRole.CREATOR) {
            return response.status(401).send({ message: "Unauthorized action: User does not own event." })
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
            return response.status(200).send({ message: "Member deleted successfully." })
        } 
    
        return response.status(401).send({ message: "Error deleting event member." })

    } catch (error) {
        console.log("error in deleteEventMember ", error)
        throw error
    }
}

// export const getAllEvents = async (request: AuthEventRequest, response: Response) => {
//     try {

//     } catch (error) {
//         console.log("error in getAllEvents ", error)
//         throw error
//     }
// }