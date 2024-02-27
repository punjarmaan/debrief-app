import { AuthRequest } from "../middleware/auth"
import { Response } from "express"
import { UserProfile } from "../types"
import User from "../models/user.model";


export const updateProfile = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { user_id } = request.params

        if (user !== user_id) {
            return response.status(401).send("Unauthorized edit request.")
        }

        const { firstName, lastName, username, phone_extension, phone_number }: UserProfile = request.body

        const userProfile = await User.findById({
            _id: user
        })

        const usernameExists = await User.findOne({
            username
        })

        const phoneNumberExists = await User.findOne({
            phone_number
        })

        if (usernameExists && (user !== usernameExists._id.toString())) {
            return response.status(409).send("Username already exists.")
        }

        if (phoneNumberExists && (user !== phoneNumberExists._id.toString())) {
            return response.status(409).send("An account with this phone number already exists.")
        }

        await User.updateOne({
            _id: user
        }, 
        {
         $set: {
            firstName,
            lastName,
            username,
            phone_extension,
            phone_number
         }
        })

        response.send({ message: "Profile updated successfully."})
    } catch (error) {
        console.log("error in updateProfile ", error)
        throw error
    }
}

export const getAllUsers = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request // doesn't return user sending the request
        const all_users = await User.find({
            $nin: [{
                _id: user
            }]
        })
        
        response.send(all_users)
    } catch (error) {
        console.log("error in getUserById ", error)
        throw error
    }
}


export const getUserById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { user_id } = request.params

        const user_to_find = await User.find({
            _id: user_id
        })
        
        response.send(user_to_find)
    } catch (error) {
        console.log("error in getUserById ", error)
        throw error
    }
}

