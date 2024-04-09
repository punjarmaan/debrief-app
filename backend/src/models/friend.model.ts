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
            type: Number,
            required: true,
            enum: [0, 1]
        }
    }
)

const Friend = mongoose.model("Friend", friendSchema)

export default Friend
