import mongoose from "mongoose"

const connectDB = async (DATABASE_URL) => {
    const dbOptions = {
        dbName: "test"
    }
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("connected to database")
    } catch (error) {
        console.log(error);
    }
}
export default connectDB