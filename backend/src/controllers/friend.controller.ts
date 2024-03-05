import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Friend from "../models/friend.model";


export const getAllFriends = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request


        const friends = await Friend.find({
            $and: [
                { 
                    $or: [
                        { "user_id": user },
                        { "friend_id": user }
                    ]
                },
                {
                    "status": "ACCEPTED"
                }
            ]
        }).populate({
            path: 'user_id',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'friend_id',
            select: 'username firstName lastName _id'
        })

        if (!friends) {
            return response.status(404).send("User friends not found.")
        }

        return response.send(friends)
    } catch (error) {
        console.log("error in getAllFriends ", error)
        throw error
    }
}

export const getFriendById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        if (!friend_id) {"Friend doesn't exist."}

        const friend = await Friend.find({
            $and: [
             { status: "ACCEPTED" },
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
                    }
                ]
            }
            ]
        }).populate({
            path: 'user_id',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'friend_id',
            select: 'username firstName lastName _id'
        })

        if (!friend) {
            return response.status(404).send("Friend not found.")
        }

        return response.send(friend)
    } catch (error) {
        console.log("error in getFriendById ", error)
        throw error
    }
}


export const addFriend = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        if (!friend_id) {"Friend doesn't exist."}
        

        const friendship = await Friend.create({
            user_id: user,
            friend_id: friend_id,
            status: "PENDING"
        })

        if (!friendship) {
            return response.send({ message: "Error creating friendship."})
        }

        return response.send(friendship)
    } catch (error) {
        console.log("error in addFriend ", error)
        throw error
    }
}

export const acceptFriendByFriendshipId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friendship_id }  = request.params

        if (!friendship_id) { return response.send("Friendship doesn't exist.") }

        const status = "ACCEPTED"

        const accepted = await Friend.updateOne({
            _id: friendship_id
        },
        {
            $set: {
                status
            }
        })

        if (accepted.modifiedCount != 1) {
            response.send({ message: "Error accepting friend." })
        }
        
        return response.send(accepted)
    } catch (error) {
        console.log("error in acceptFriend ", error)
        throw error
    }
}

export const acceptFriendByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id }  = request.params

        if (!friend_id) { return response.send("Friendship doesn't exist.") }


        const status = "ACCEPTED"
        const result = await Friend.updateOne({
            user_id: friend_id,
            friend_id: user
        },
        {
            $set: {
                status
            }
        })

        if (result.modifiedCount == 1) {
            return response.send({ message: "Friend request accepted successfully." })
        }

        return response.send({ message: "Error accepting friend request." })
    } catch (error) {
        console.log("error in acceptFriend ", error)
        throw error
    }
}

export const deleteFriendByFriendshipId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friendship_id } = request.params

        if (!friendship_id) { return response.send("Friend doesn't exist.") }

        const result = await Friend.deleteOne({ 
           _id: friendship_id
        },
        {
            $or: [
                { user_id: user },
                { friend_id: user }
            ]
        }
        )

        if (result.deletedCount == 1) {
            return response.send({ message: "Friend removed successfully." })
        }

        return response.send({ message: "Error removing friend." })
    } catch (error) {
        console.log("error in acceptFriend ", error)
        throw error
    }
}

export const deleteFriendByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        if (!friend_id) {return response.send("Friend doesn't exist.")}

        const frand = friend_id

        const status = "ACCEPTED"
        const result = await Friend.deleteOne({ 
                status 
            },
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
                            { friend_id: user}
                        ] 
                    }
                ]
            }
        )


        if (result.deletedCount == 1) {
            return response.send({ message: "Friend removed successfully." })
        }

        return response.send({ message: "Error removing friend." })
    } catch (error) {
        console.log("error in acceptFriend ", error)
        throw error
    }
}