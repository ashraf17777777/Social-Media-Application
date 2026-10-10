import joi from "joi";


export const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmedPassword: joi.ref('password'),
    userName: joi.string().min(3).max(20).required(),
    phoneNumber: joi.string().required(),
    age: joi.number().min(18).max(100).required(),
    otp: joi.string().required(),
    profileImage: joi.string().optional()
})


export const sendOtpSchema =joi.object({
    email: joi.string().email().required()
}).required(true)


export const forgetPassSchema =joi.object({
    email: joi.string().email().required()
}).required(true)


export const resetPassword  = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmedPassword: joi.ref('password'),
    otp: joi.string().required()
}).required(true)


export const refreshTokenSchema = joi.object({
    refreshToken: joi.string().required()
}).required(true)

export const loginGamilSchema = joi.object({
    idToken: joi.string().required()
})