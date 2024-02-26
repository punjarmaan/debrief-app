import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        creator_id: {
            type: String,
            required: true,
        },
        file_key: {
            type: String,
            required: true,
        },
    }, 
    {
        timestamps: true
    }
)

const Img = mongoose.model("Event", imageSchema)

export default Img