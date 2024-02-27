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

        if (!friends) {
            response.status(404).send("User friends not found")
        }

        response.send(friends)
    } catch (error) {
        console.log("error in getAllFriends ", error)
        throw error
    }
}

export const getFriendById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        const friend = await Friend.find({
            $and: [
             { status: 'APPROVED' },
             {
                $or: [
                    {
                        $and: [
                        { user_id: user },
                        { friend_id: friend_id}
                        ]
                    },
                    {
                        $and: [
                        { user_id: friend_id },
                        { friend_id: user }
                        ]
                    },
                ]
            }]
        })

        if (!friend) {
            response.status(404).send("Friend not found.")
        }

        return response.send(friend)
    } catch (error) {
        console.log("error in getFriendById ", error)
        throw error
    }
}
