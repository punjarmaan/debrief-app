import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface AuthRequest extends Request {
    user: string,
}

export const authenticateMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers
        
        if (!authorization) {
            return response.status(401).json({
                error: "Unauthorized action"
            })
        }

        const token = authorization
        const {_id} = jwt.verify(token, "express")
        const userExists = await User.findOne({ _id })

        if (userExists) {
            request.user = userExists.id
        }

        next()
    } catch (error) {
        console.log("error in authenticationMiddleware ", error)
        throw error
    }
}