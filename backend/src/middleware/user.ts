import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';
import User from '../models/user.model';
import idValidation from './id';

export const userMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {

        const { mem_id } = request.params
        const user = await idValidation(mem_id, User)
        
        if (user) {
            next()
        } else {
            return response.status(404).json({
                error: "User doesn't exist."
            })
        }

    } catch (error) {
        console.log("error in userMiddleware ", error)
        throw error
    }
}