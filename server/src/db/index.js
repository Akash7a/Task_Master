import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connection HOST:: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Error while connecting to MongoDB::${error}`);
    }
}
export default connectDB;