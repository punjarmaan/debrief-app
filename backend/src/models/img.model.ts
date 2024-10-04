import mongoose from "mongoose";

const imgSchema = new mongoose.Schema(
    {
        creator_id: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
        tags: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            required: false,
            default: []
        }
    }, 
    {
        timestamps: true
    }
)

const Img = mongoose.model("Img", imgSchema)

export default Img