import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
    user: string,
}

export const authenticateMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        // const { authorization } = request.headers
        const token = request.headers['authorization'].split(" ")[1]

        if (!token || token=="") {
            return response.status(401).json({
                error: "Unauthorized action"
            })
        }

        let userExists;
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)
        if (mongoose.Types.ObjectId.isValid(_id)) {
            userExists = await User.findById({ 
                _id: _id
            })
        }

        if (userExists._id) {
            request.user = userExists.id
        } else {
            return response.status(401).json({
                error: "Failed to authorize user."
            })
        }

        next()
    } catch (error) {
        return response.status(409).send({ "message": "Invalid token." })
    }
}