import { Request, Response } from "express";
import Event from "../models/event.model";
import { EventProfile } from "../types";
import { AuthRequest } from "../middleware/auth";

export const getAllEvents = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const events = await Event.find({
            creator_id: user
        })
        response.status(200).send(events)
    } catch (error) {
        console.log("error in getAllEvents ", error)
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
        const { id } = request.params
        const { user } = request

        const eventToDelete = await Event.findById(id)

        if (!eventToDelete) {
            response.status(404).send({ message: "Event does not exist." })
        } else if (!(eventToDelete.creator_id.toString() === user)) {
            response.status(401).send({ message: "Unauthorized deletion: user does not own event "})
        }

        await Event.deleteOne({
            _id: id
        }).then(() => {
            response.status(204).send({ message: "Event deleted by creator."})
        })

    } catch (error) {
        console.log("error in getAllEvents ", error)
        throw error
    }
}

export const updateEvent = async (request: AuthRequest, response: Response) => {
    try {
        const { _id, title }: EventProfile = request.body
        const { user } = request

        await Event.updateOne({
            _id
        }, 
        {
         $set: {
            title
         }
        })
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

// const getAllEvents = async (request: AuthRequest, response: Response) => {
    // try {

    // } catch (error) {
    //     console.log("error in getAllEvents ", error)
    //     throw error
    // }
// }