const mongoose = require('mongoose');
require('dotenv').config();

export const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_TEMP
        )
        
        if (connection) {
            console.log("Connected to MongoDB!")
        }
    } catch (error) {
        console.log('Error in connectToDB', error)
        throw error
    }
}