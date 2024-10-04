import mongoose, { isObjectIdOrHexString } from 'mongoose';

const idValidation = async (id: string, model: typeof mongoose.Model) => {
    try {
        if (isObjectIdOrHexString(id)) {
            return await model.findById(id);
        } else {
            return null
        }
    } catch (error) {
        console.log("error in idValidation ", error)
        throw error
    }
}

export default idValidation;