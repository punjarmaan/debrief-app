import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface AuthRequest extends Request {
    user: string,
}

export const authenticateMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        // const { authorization } = request.headers
        const token = request.headers['authorization'].split(" ")[1]

        if (!token) {
            return response.status(401).json({
                error: "Unauthorized action"
            })
        }

        const {_id} = jwt.verify(token, process.env.JWT_SECRET)
        const userExists = await User.findById({ 
            _id: _id
        })

        if (userExists) {
            request.user = userExists.id
        }

        next()
    } catch (error) {
        console.log("error in authenticationMiddleware ", error)
        throw error
    }
}