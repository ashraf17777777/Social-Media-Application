import { minLength } from "class-validator";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';




export const userRole = {
    admin: "admin",
    user: "user"
}
export const provider = {
    system: "system",
    google: "google"
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
    },
    password: {
        type: String,
        required: function () {
            console.log(this.provider)
            return this.provider == provider.system ? true : false
        }
    },
    profileImage: {
        type: [String],
    },
    coverPics:{
        type: [String],
    },
    userName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    isActivate: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.user
    },
    provider: {
        type: String,
        enum: Object.values(provider),
        default: provider.system
    }
}, {
    timestamps: true
});

userSchema.pre("save", function () {
    if (this.isModified("password")) {
        console.log(this.password);
        this.password = bcrypt.hashSync(this.password, 10);
    }
})


const User = mongoose.model('User', userSchema);


export default User