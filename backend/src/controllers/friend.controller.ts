import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Friend from "../models/friend.model";


export const getAllFriends = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request

        const friends = await Friend.find({
            $and: [
             { status: 'APPROVED' },
             {
                $or: [
                    { user_id: user },
                    { friend_id: user }
                ]
            }]
        })
    } catch (error) {
        console.log("error in getAllFriends ", error)
        throw error
    }
}

export const getFriendById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request

        const friends = await Friend.find({
            $and: [
             { status: 'APPROVED' },
             {
                $or: [
                    { user_id: user },
                    { friend_id: user }
                ]
            }]
        })
    } catch (error) {
        console.log("error in getAllFriends ", error)
        throw error
    }
}
