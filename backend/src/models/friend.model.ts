import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'APPROVED'],
            default: 'PENDING'
        }
    }
)

const Friend = mongoose.model("Friend", friendSchema)

export default Friend
