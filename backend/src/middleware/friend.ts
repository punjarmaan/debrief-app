import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';
import User from '../models/user.model'
import { BoxRole } from '../types/box.enum';
import mongoose, { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

const friendValidation = async (friend_id: string) => {
    try {
        if (isObjectIdOrHexString(friend_id)) {
            return await User.findById(friend_id);
        } else {
            return null
        }
    } catch (error) {
        console.log("error in friendValidation ", error)
        throw error
    }
}

export const friendMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {

        const { friend_id } = request.params
        const friend = await friendValidation(friend_id)
        
        if (friend) {
            next()
        } else {
            return response.status(404).json({
                error: "User doesn't exist."
            })
        }

    } catch (error) {
        console.log("error in friendMiddleware ", error)
        throw error
    }
}