
import mongoose, { Schema } from "mongoose";

const otp = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})


const OTP = mongoose.model("OTP", otp)
export default OTP