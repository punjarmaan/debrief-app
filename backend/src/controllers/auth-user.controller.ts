import { AuthRequest } from "../middleware/auth"
import { Response } from "express"
import { UserProfile } from "../types"
import User from "../models/user.model";


export const updateProfile = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request

        // if (user !== user_id) {
        //     return response.status(401).send("Unauthorized edit request.")
        // }

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

        if (!userProfile) {
            return response.status(404).send({ message: "User doesn't exist." })
        }

        if (usernameExists && (user !== usernameExists._id.toString())) {
            return response.status(409).send({ message: "Username already exists." })
        }

        if (phoneNumberExists && (user !== phoneNumberExists._id.toString())) {
            return response.status(409).send({ message: "Phone number is associated with an existing account." })
        }

        const result =await User.updateOne({
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

        if (result.modifiedCount == 1) {
            return response.send({ message: "Profile updated successfully."})
        } 
        
        return response.send({ message: "Error updating profile." })

    } catch (error) {
        console.log("error in updateProfile ", error)
        throw error
    }
}

export const getAllUsers = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request // doesn't return user sending the request
        const all_users = await User.find({
            _id: {
                $nin: [user]
            }
        }).select('-password -phone_extension -phone_number -_id -createdAt -updatedAt -__v')
        
        if (!all_users) {
            response.send({ message: "Error retrieving users." })
        }
    
        return response.status(200).send(all_users)
    } catch (error) {
        console.log("error in getAllUsers ", error)
        throw error
    }
}


export const getUserById = async (request: AuthRequest, response: Response) => {
    try {
        const { user } = request
        const { user_id } = request.params

        const user_to_find = await User.findById({
            _id: user_id
        }).select('-paswsord -phone_extension -phone_number -createdAt -updatedAt -__v')

        if (user_to_find) {
            return response.status(200).send(user_to_find)
        }

        return response.status(404).send({ message: "User not found." })
    } catch (error) {
        console.log("error in getUserById ", error)
        throw error
    }
}

