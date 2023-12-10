import mongoose from "mongoose";

const userModel =new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})

export const userModels= mongoose.model("user",userModel)











9





































