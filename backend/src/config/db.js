import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connection to the mongodb Atlas database successfully");

    } catch (error) {
        console.error("Error connecting to the MongoDB Atlas database", error.message);
        
    }
}

export default connectToDatabase;