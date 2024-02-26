import mongoose from "mongoose";
import Img from "./img.model";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        creator_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        locked: {
            type: Boolean,
            required: false,
            default: true
        },
        members: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            required: false,
            default: []
        },
        images: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Img'
            }],
            required: false,
            default: []
        }
    }, 
    {
        timestamps: true
    }
)

const Event = mongoose.model("Event", eventSchema)

export default Event