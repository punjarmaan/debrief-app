import mongoose from "mongoose";
import Img from "./img.model";

const boxSchema = new mongoose.Schema(
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
        events: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
            }],
            required: false,
            default: []
        },
        members: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            required: true,
        },
        private: {
            type: Boolean,
            required: true
        }
    }, 
    {
        timestamps: true
    }
)

const Box = mongoose.model("Box", boxSchema)

export default Box