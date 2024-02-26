import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone_extension: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true,
            unique: true
        },
        // friends: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User'
        // }]
    }, 
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User