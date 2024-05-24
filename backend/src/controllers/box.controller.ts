import { Response } from "express";
import Box from "../models/box.model";
import { BoxProfile } from "../types";
import { BoxRole } from "../types/box.enum";
import { AuthBoxRequest } from "../middleware/box";
import User from "../models/user.model";
import Event from "../models/event.model"
import mongoose from "mongoose";

export const getAllBoxes = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const boxes = await Box.find({
            members: user
        })
        .populate({
            path: 'events',
            select: 'title'
        })

        if (!boxes) {
            return response.status(404).send("Error finding boxes.")
        }
        return response.status(200).send(boxes)
    } catch (error) {
        console.log("error in getAllBoxes\n", error)
        throw error
    }
}

export const getBoxById = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params

        const box = await Box.findById({
            _id: box_id
        }).populate({
            path: 'events',
            select: 'title images members'
        })

        if (box) {
            return response.status(200).send(box)  
        } 
        
        return response.status(401).send("Box doesn't exist.")
    } catch (error) {
        console.log("error in getBoxById ", error)
        throw error
    }
}

export const unlockBoxById = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params

        const box = await Box.findOneAndUpdate({
            _id: box_id
        },
        {
            $set: {
                locked: false
            }
        })

        if (box) {
            return response.status(200).send(box)  
        } 
        
        return response.status(401).send("Box doesn't exist.")
    } catch (error) {
        console.log("error in unlockBoxById ", error)
        throw error
    }
}


export const getEventsByBoxId = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params

        const box = await Box.findById({
            box_id
        }).populate({
            path: 'events',
            select: 'title images members'
        })

        if (box) {
            return response.status(200).send(box)  
        } 
        
        return response.status(401).send("Box doesn't exist.")
    } catch (error) {
        console.log("error in getBoxById ", error)
        throw error
    }
}

export const createBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { title, is_private }: BoxProfile = request.body

        if (!title || !is_private) {
            return response.status(400).send({ message: "Invalid Request: missing parameters." })
        }
        const { user } = request
        
        const box = await Box.create({
            title: title,
            creator_id: user,
            members: [user],
            private: is_private
        })

        if (box) {
            return response.status(200).send(box)  
        }
        
        return response.status(400).send("Error creating box.")

    } catch (error) {
        console.log("error in createBox ", error)
    }
}

export const deleteBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { box_id } = request.params
        const { user } = request

        if (request.role != BoxRole.CREATOR) {
            return response.status(401).send({ message: "Unauthorized action: user does not own box." })
        }

        const result = await Box.deleteOne({
            _id: box_id
        })

        if (result.deletedCount == 1) {
            return response.status(200).send({ message: "Box deleted by creator."})
        }

    } catch (error) {
        console.log("error in deleteBox ", error)
        throw error
    }
}

export const updateBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { title, is_private}: BoxProfile = request.body
        const { box_id } = request.params
        const { user } = request
        
        const result = await Box.updateOne({
            _id: box_id
        }, 
        {
         $set: {
            title,
            private: is_private
         }})

        if (result.modifiedCount == 1) {
            return response.status(200).send({ message: "Updated box successfully." })
        }
        
        return response.send({ message: "Error updating box." })
    } catch (error) {
        console.log("error in updatebox ", error)
        throw error
    }
}

export const addBoxMember = async (request: AuthBoxRequest, response: Response) => {
    try {

        const { user } = request
        const { box_id } = request.params
        const { new_mem_id } = request.body
        const is_private = await (await Box.findById(box_id)).private
        let new_mem_exists;

        if (is_private) {
            return response.status(405).send({ message: "Box is private." })
        }

        if (mongoose.Types.ObjectId.isValid(new_mem_id)) {
            new_mem_exists = await User.findById(new_mem_id)
        }

        if (!new_mem_exists || new_mem_exists.id == null) {
            return response.status(404).send({ message: "User doesn't exist." })
        }
        
        const result = await Box.updateOne(
            { _id: box_id,
              members: user
            },
            {
                $push: {
                    members: new_mem_id
                }
        })
        

        if (result.modifiedCount == 1) {
            return response.send({ message: "Member added successfully."})
        } 
        
        return response.send({ message: "Error adding member." })
    } catch (error) {
        console.log("error in addboxMember ", error)
        throw error
    }
}

export const deleteBoxMember = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params
        const { del_mem_id } = request.body
        let del_mem_exists;

        if (request.role != BoxRole.CREATOR) {
            return response.status(401).send()
        }

        if (mongoose.Types.ObjectId.isValid(del_mem_id)) {
            del_mem_exists = await User.findById(del_mem_id)
        }

        if (!del_mem_exists || del_mem_exists.id == null) {
            return response.status(404).send({ message: "User doesn't exist" })
        }
        
        const result = await Box.updateOne({ 
                _id: box_id,
            },
            {
                $pull: {
                    members: del_mem_id
                }
        })

        if (result.modifiedCount == 1) {
            return response.send({ message: "Member deleted successfully."})
        } 
        
        return response.send({ message: "Error deleting member" })
        
    } catch (error) {
        console.log("error in deleteboxMember ", error)
        throw error
    }
}

export const addExistingEvent = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { box_id } = request.params
        const { new_event_id } = request.body

        const event_exists = await Event.findById(new_event_id)
        

        if (!event_exists) {
            return response.status(404).send({ message: "Event doesn't exist." })
        }

        const result = await Box.updateOne(
            { 
                _id: box_id,
                members: user
            },
            {
                $push: {
                    events: new_event_id
                }
        })
        

        if (result.modifiedCount == 1) {
            return response.status(200).send({ message: "Event added to box successfully."})
        } 
        
        return response.status(404).send({ message: "Event not found." })
    } catch (error) {
        console.log("error in addExistingEvent ", error)
        throw error
    }
}

export const leaveBox = async (request: AuthBoxRequest, response: Response) => {
    try {
        const { user } = request
        const { event_id } = request.params
        const { role } = request

        if (role == BoxRole.CREATOR) {
            return response.status(401).send({ message: "User cannot leave their own box." })
        }

        const result = await Box.updateOne({ 
            _id: event_id,
        },
        {
            $pull: {
                members: user
            }
        })

        if (result.modifiedCount == 1) {
            return response.status(200).send({ message: "Left box successfully." })
        } 
    
        return response.status(401).send({ message: "Error leaving box." })

    } catch (error) {
        console.log("error in leaveBox ", error)
        throw error
    }
}


// export const addNewEvent = async (request: AuthBoxRequest, response: Response) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { user } = request
//         const { box_id } = request.params
//         const { title }: EventProfile = request.body

//         const event = await Event.create({
//             creator_id: user,
//             title: title,
//             members: [user]
//         }, {
//             session
//         }) 



//         const result = await Box.updateOne(
//             { 
//                 _id: box_id,
//                 members: user
//             },
//             {
//                 $push: {
//                     events: event[0]._id
//                 }
//         },
//         {
//             session
//         })
        

//         if (!result || result.modifiedCount != 1) {
//             await session.abortTransaction();
//             return response.send({ message: "Error while adding event to box."})
//         } 

//         await session.commitTransaction();
//         return response.send({ message: "New event added successfully" })
//     } catch (error) {
//         await session.abortTransaction();
//         console.log("error in addNewEvent\n", error)
//     } finally {
//         session.endSession();
//     }
// } 


// export const getAllboxs = async (request: AuthBoxRequest, response: Response) => {
//     try {

//     } catch (error) {
//         console.log("error in getAllEvents ", error)
//         throw error
//     }
// }