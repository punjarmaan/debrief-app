import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import FriendRequest from "../models/friend-request.model";
import { isObjectIdOrHexString } from "mongoose";
import mongoose from "mongoose";
import Friend from "../models/friend.model";


export const getAllReceivedRequests = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request

        const requests = await FriendRequest.find({
            receiver: user
        }).populate({
            path: 'sender',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'receiver',
            select: 'username firstName lastName _id'
        })


        if (!requests) {
            return response.status(404).send("Requests not found.")
        }

        return response.status(200).send(requests)
    } catch (error) {
        console.log("error in getAllIncomingRequests ", error)
        throw error
    }
}

export const getAllSentRequests = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request

        const requests = await FriendRequest.find({
            sender: user
        }).populate({
            path: 'sender',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'receiver',
            select: 'username firstName lastName _id'
        })


        if (!requests) {
            return response.status(404).send("Requests not found.")
        }

        return response.status(200).send(requests)
    } catch (error) {
        console.log("error in getAllIncomingRequests ", error)
        throw error
    }
}

export const getRequestByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        if (!friend_id) {
            return response.status(404).send({ message: "User doesn't exist." })
        }

        const friend_request = await FriendRequest.find({
            $or: [
                {
                    $and: [
                    { sender: user },
                    { receiver: friend_id}
                    ]
                },
                {
                    $and: [
                    { sender: friend_id },
                    { receiver: user }
                    ]
                }
            ]
        }).populate({
            path: 'sender',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'receiver',
            select: 'username firstName lastName _id'
        })

        if (!friend_request) {
            return response.status(404).send({ message: "Friend request not found." })
        }

        return response.status(200).send(friend_request)
    } catch (error) {
        console.log("error in getRequestByUserId ", error)
        throw error
    }
}

export const getRequestById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { request_id } = request.params

        if (!request_id || !isObjectIdOrHexString(request_id)) { return response.status(400).send({ message: "Invalid friendship request id." }) }

        const friend_request = await FriendRequest.findOne({
            _id: request_id
         },
         {
             $or: [
                 { sender: user },
                 { receiver: user }
             ]
         }).populate({
            path: 'sender',
            select: 'username firstName lastName _id'
        }).populate({
            path: 'receiver',
            select: 'username firstName lastName _id'
        })

        if (!friend_request) {
            return response.status(404).send({ message: "Friend request not found." })
        }

        return response.status(200).send(friend_request)
    } catch (error) {
        console.log("error in getRequestById ", error)
        throw error
    }
}


export const addFriendByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params
        

        const friend_request = await FriendRequest.create({
            sender: user,
            receiver: friend_id
        })

        if (!friend_request) {
            return response.status(400).send({ message: "Error adding friend."})
        }

        return response.send(friend_request)
    } catch (error) {
        console.log("error in addFriend ", error)
        throw error
    }
}

export const acceptReqById = async (request: AuthRequest, response: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user } = request
        const { request_id }  = request.params

        if (!request_id || !isObjectIdOrHexString(request_id)) { return response.status(400).send({ message: "Invalid request id." }) }

        const result = await FriendRequest.findOneAndDelete({
            _id: request_id
        },{
            session
        })

        if (!result) {
            return response.status(404).send({ message: "Error finding friend request." })
        }

        const friend = await Friend.create({
            user_id: result.sender,
            friend_id: user,
        }, {
            session
        })

        if (!friend) {
            return response.status(400).send({ message: "Error creating friend." })
        }

        return response.status(200).send({ message: "Friend created successfully." })
    } catch (error) {
        await session.abortTransaction();
        console.log("error in acceptReqById\n", error)
    } finally {
        session.endSession();
    }
}

export const acceptReqByUserId = async (request: AuthRequest, response: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user } = request
        const { friend_id }  = request.params

        const result = await FriendRequest.deleteOne({
            sender: friend_id,
            receiver: user
        },{
            session
        })

        if (result.deletedCount != 1) {
            return response.status(404).send({ message: "Error finding friend request." })
        }

        const friend = await Friend.create({
            user_id: friend_id,
            friend_id: user,
        }, {
            session
        })

        if (!friend) {
            return response.status(400).send({ message: "Error creating friend." })
        }

        return response.status(200).send({ message: "Friend created successfully." })
    } catch (error) {
        await session.abortTransaction();
        console.log("error in acceptReqByUserId\n", error)
    } finally {
        session.endSession();
    }
}

export const rejectReqById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { request_id } = request.params

        if (!request_id || !isObjectIdOrHexString(request_id)) { return response.status(400).send({ message: "Invalid request id." }) }

        const result = await Friend.deleteOne({ 
           $and: [
            { _id: request_id},
            { receiver: user }
           ]
        })

        if (result.deletedCount == 1) {
            return response.send({ message: "Request rejected successfully." })
        }

        return response.status(404).send({ message: "Friend request not found." })
    } catch (error) {
        console.log("error in rejectReqById ", error)
        throw error
    }
}

export const rejectReqByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        const result = await FriendRequest.deleteOne({ 
           $and: [
            { sender: friend_id},
            { receiver: user }
           ]
        })

        if (result.deletedCount == 1) {
            return response.send({ message: "Request rejected successfully." })
        }

        return response.status(404).send({ message: "Friend request not found." })
    } catch (error) {
        console.log("error in rejectReqByUserId ", error)
        throw error
    }
}

export const deleteReqById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { request_id } = request.params

        if (!request_id || !isObjectIdOrHexString(request_id)) { return response.status(400).send({ message: "Invalid request id." }) }

        const result = await Friend.deleteOne({ 
           $and: [
            { _id: request_id},
            { sender: user }
           ]
        })

        if (result.deletedCount == 1) {
            return response.send({ message: "Request deleted successfully." })
        }

        return response.status(404).send({ message: "Friend request not found." })
    } catch (error) {
        console.log("error in deleteReqById ", error)
        throw error
    }
}

export const deleteReqByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        const result = await FriendRequest.deleteOne({ 
           $and: [
            { sender: user},
            { receiver: friend_id }
           ]
        })

        if (result.deletedCount == 1) {
            return response.send({ message: "Request deleted successfully." })
        }

        return response.status(404).send({ message: "Friend request not found." })
    } catch (error) {
        console.log("error in deleteReqByUserId ", error)
        throw error
    }
}