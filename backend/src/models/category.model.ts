import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        events: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
            }],
            required: false,
            default: []
        }
    },
    {
        timestamps: true
    }
)

const Category = mongoose.model("Category", categorySchema)

export default Category
