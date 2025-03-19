import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const AuthModel = mongoose.model("Users", AuthSchema);

export default AuthModel