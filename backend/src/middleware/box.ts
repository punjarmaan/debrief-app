import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';
import Box from "../models/box.model";
import { BoxRole } from '../types/box.enum';
import mongoose, { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface AuthBoxRequest extends AuthRequest {
    role: BoxRole
}

const boxValidation = async (box_id: string) => {
    try {
        if (isObjectIdOrHexString(box_id)) {
            return await Box.findById(box_id);
        } else {
            return null
        }
    } catch (error) {
        console.log("error in boxValidation ", error)
        throw error
    }
}

export const boxRequestMiddleware = async (request: AuthBoxRequest, response: Response, next: NextFunction) => {
    try {

        const { box_id } = request.params
        const { user } = request

        const box = await boxValidation(box_id)
        
        if (box) {
            const is_creator = box.creator_id.toString() == user
            const is_member = box.members.some(id => id.toString() == user)

            if (is_creator) {
                request.role = BoxRole.CREATOR
            } else if (is_member) {
                request.role = BoxRole.MEMBER
            } else {
                return response.status(401).json({
                    error: "Unauthorized action: user does not belong to box."
                })
            }
            
            next()
        } else {
            return response.status(404).json({
                error: "Box doesn't exist."
            })
        }

    } catch (error) {
        console.log("error in boxRequestMiddleware ", error)
        throw error
    }
}

export const boxCreatorMiddleware = async (request: AuthBoxRequest, response: Response, next: NextFunction) => {
    try {
        if (request.role == BoxRole.CREATOR) {
            next()
        } else {
            return response.status(401).send({
                message: "Unauthorized action: user does not own box."
            })
        }

    } catch (error) {
        console.log("error in boxCreatorMiddleware ", error)
        throw error
    }
}