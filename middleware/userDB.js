import mongoose from "mongoose";

export const userDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'codeswear'

        }
        
    } catch (error) {
        console.log(error)
        
    }
}