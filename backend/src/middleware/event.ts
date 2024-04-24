import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';
import Event from "../models/event.model";
import { EventRole } from '../types/event.enum';
import mongoose from 'mongoose';

export interface AuthEventRequest extends AuthRequest {
    role: EventRole
}

const eventValidation = async (event_id: string) => {
    try {
        if (mongoose.Types.ObjectId.isValid(event_id)) {
            return await Event.findById(event_id);
        } else {
            return null
        }
    } catch (error) {
        console.log("error in eventValidation ", error)
        throw error
    }
}

export const eventRequestMiddleware = async (request: AuthEventRequest, response: Response, next: NextFunction) => {
    try {

        const { event_id } = request.params
        const { user } = request

        const event = await eventValidation(event_id)
        
        if (event) {
            const is_creator = event.creator_id.toString() == user
            const is_member = event.members.some(id => id.toString() == user)

            if (is_creator) {
                request.role = EventRole.CREATOR
            } else if(is_member) {
                request.role = EventRole.MEMBER
            } else {
                return response.status(401).send({
                    error: "Unauthorized action: user does not belong to event."
                })
            }
            
            next()
        } else {
            return response.status(404).send({
                error: "Event doesn't exist."
            })
        }

    } catch (error) {
        console.log("error in eventRequestMiddleware ", error)
        throw error
    }
}

export const eventCreatorMiddleware = async (request: AuthEventRequest, response: Response, next: NextFunction) => {
    try {
        if (request.role == EventRole.CREATOR) {
            next()
        } else {
            return response.status(401).send({
                message: "Unauthorized action: user does not own event."
            })
        }

    } catch (error) {
        console.log("error in eventCreatorMiddleware ", error)
        throw error
    }
}