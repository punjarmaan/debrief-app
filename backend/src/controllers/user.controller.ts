import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserProfile }  from "../types";

const getUserToken = (_id: string | Types.ObjectId) => {
    const authenticatedToken = jwt.sign({_id}, "express", {
        expiresIn: "7d"
    })

    return authenticatedToken
}

export const createUser = async (request: Request, response: Response) => {
    try { // Receive from request body
        const firstName = request.body.firstName;
        const lastName = request.body.lastName;
        const username = request.body.username;
        const pass = request.body.password;
        const phone_extension = request.body.phone_extension;
        const phone_number = request.body.phone_number;

        console.log(request.body.firstName)
        // {firstName, lastName, username, password, phone_extension, phone_number} = request.body
        const userExists = await User.findOne({
            username
        })

        if (userExists) {
            return response.status(409).send({ error: "User already exists." })
        }
        
        if (!pass || pass.length == 0){
            return response.status(401).send({ error: "Invalid password." })
        }
        
        const password = await bcrypt.hash(pass, 12)

        const user = await User.create({
            firstName,
            lastName,
            username,
            password,
            phone_extension,
            phone_number
        })

        if (!user) {
            response.send({ message: "Error creating user." })
        }

        return response.status(201).send({message: "User created successfully."})

    } catch (error) {
        console.log('error in createUser', error);
        throw error
    }
}

export const loginUser = async (request: Request, response: Response) => {
    try {
        const { phone_number, password }: UserProfile = request.body

        const userExists = await User.findOne({
            phone_number
        })

        if (!userExists) {
            return response.status(409).send({ message: "User doesn't exist." })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            (
                await userExists
            ).password
        )

        if (passwordMatch) {
            const token = getUserToken((await userExists)._id)
            return response.send({
                token,
                user: {
                    phone_number: phone_number,
                    firstName: (await userExists).firstName,
                    lastName: (await userExists).lastName
                }
            })
        } else {
            return response.status(400).send({ message: "Incorrect password."})
        }

    } catch (error) {
        return response.status(422).send({ error: "Invalid login parameters." })
    }
}