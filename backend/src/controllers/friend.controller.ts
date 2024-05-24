import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Friend from "../models/friend.model";
import { FriendStatus } from "../types/friend.enum";
import { isObjectIdOrHexString } from "mongoose";


export const getAllFriends = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request


        const friends = await Friend.find({
            $or: [
                { "user_id": user },
                { "friend_id": user }
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

        return response.status(200).send(friends)
    } catch (error) {
        console.log("error in getAllFriends ", error)
        throw error
    }
}

export const getFriendByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        const friend = await Friend.find({
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
        }).populate({
            path: 'user_id',
            select: 'username firstName lastName _id'
        })
        .populate({
            path: 'friend_id',
            select: 'username firstName lastName _id'
        })

        if (!friend) {
            return response.status(404).send({ message: "Friend not found." })
        }

        return response.status(200).send(friend)
    } catch (error) {
        console.log("error in getFriendByUserId ", error)
        throw error
    }
}

export const getFriendByFriendshipId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friendship_id } = request.params

        if (!friendship_id || !isObjectIdOrHexString(friendship_id)) { return response.status(400).send({ message: "Invalid friendship id." }) }

        const friend = await Friend.findOne({
            _id: friendship_id
         },
         {
             $or: [
                 { user_id: user },
                 { friend_id: user }
             ]
         }).populate({
            path: 'user_id',
            select: 'username firstName lastName _id'
        }).populate({
            path: 'friend_id',
            select: 'username firstName lastName _id'
        })

        if (!friend) {
            return response.status(404).send({ message: "Friend not found." })
        }

        return response.status(200).send(friend)
    } catch (error) {
        console.log("error in getFriendByFriendshipId ", error)
        throw error
    }
}


// export const addFriend = async (request: AuthRequest, response: Response) => {
//     try {
//         const { user } = request
//         const { friend_id } = request.params

//         if (!friend_id) {
//             return response.status(404).send({ message: "Friend doesn't exist." })
//         }
        

//         const friendship = await Friend.create({
//             user_id: user,
//             friend_id: friend_id,
//             status: FriendStatus.PENDING
//         })

//         if (!friendship) {
//             return response.send({ message: "Error creating friendship."})
//         }

//         return response.send(friendship)
//     } catch (error) {
//         console.log("error in addFriend ", error)
//         throw error
//     }
// }

// export const acceptFriendByFriendshipId = async (request: AuthRequest, response: Response) => {
//     try {
//         const { user } = request
//         const { friendship_id }  = request.params

//         if (!friendship_id) { return response.send("Friendship doesn't exist.") }

//         const status = FriendStatus.ACCEPTED

//         const accepted = await Friend.updateOne({
//             _id: friendship_id
//         },
//         {
//             $set: {
//                 status
//             }
//         })

//         if (accepted.modifiedCount != 1) {
//             response.send({ message: "Error accepting friend." })
//         }
        
//         return response.send(accepted)
//     } catch (error) {
//         console.log("error in acceptFriend ", error)
//         throw error
//     }
// }

// export const acceptFriendByUserId = async (request: AuthRequest, response: Response) => {
//     try {
//         const { user } = request
//         const { friend_id }  = request.params

//         if (!friend_id) { return response.send("Friendship doesn't exist.") }


//         const status = FriendStatus.ACCEPTED
//         const result = await Friend.updateOne({
//             user_id: friend_id,
//             friend_id: user
//         },
//         {
//             $set: {
//                 status
//             }
//         })

//         if (result.modifiedCount == 1) {
//             return response.send({ message: "Friend request accepted successfully." })
//         }

//         return response.send({ message: "Error accepting friend request." })
//     } catch (error) {
//         console.log("error in acceptFriend ", error)
//         throw error
//     }
// }

export const deleteFriendByFriendshipId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friendship_id } = request.params

        if (!friendship_id || !isObjectIdOrHexString(friendship_id)) { return response.status(400).send({ message: "Invalid friendship id." }) }

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

        return response.status(404).send({ message: "Friend not found." })
    } catch (error) {
        console.log("error in deleteFriendByFriendshipId ", error)
        throw error
    }
}

export const deleteFriendByUserId = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { friend_id } = request.params

        const result = await Friend.deleteOne({
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
        })


        if (result.deletedCount == 1) {
            return response.send({ message: "Friend removed successfully." })
        }

        return response.status(404).send({ message: "Friend not found." })
    } catch (error) {
        console.log("error in deleteFriendByUserId ", error)
        throw error
    }
}