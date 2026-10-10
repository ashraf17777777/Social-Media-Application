import User, { provider } from "../../DB/models/user.model.js";
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import sendEmail from "../../utils/sendEmail.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emailEmitter } from "../../utils/email.event.js";
import randomString from 'randomized-string'
import OTP from "../../DB/models/otp.model.js";
import { OAuth2Client } from "google-auth-library";
import s3BucketService from "../../utils/S3Buket/s3-Service.js";
import { storageTypes } from "../../utils/multer.js";
export const register = asyncHandler(async (req, res, next) => {

    const { email, password, userName, phoneNumber, confirmedPassword, otp } = req.body;

    // create ====> save 

    const user = await User.create({ email, userName, phoneNumber: CryptoJS.AES.encrypt(phoneNumber, process.env.ENCRYPTION_KEY), password, confirmedPassword: bcrypt.hashSync(confirmedPassword, 10) });
    const otpModel = await OTP.findOne({ email, otp });
    user.isActivate = true;
    res.status(201).json({ success: true, message: "user created successfully", user })

})



export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return next(new Error("password isn't match ", { cause: 400 }))
        }
        if (!user.isActivate) {
            return next(new Error("user is not activated", { cause: 400 }))
        }
        const access_token = await jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY_ACCESS, { expiresIn: "1d" })
        const refresh_token = await jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY_REFRESH, { expiresIn: "7d" })
        res.status(200).json({ success: true, message: "user logged in successfully", access_token, refresh_token })
    } catch (error) {
        return next(error)
    }
}

export const profile = async (req, res) => {
    try {
        let { user } = req

        user.phoneNumber = CryptoJS.AES.decrypt(user.phoneNumber, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
        res.status(200).json({ success: true, message: "user profile", user })

    } catch (error) {
        res.json({ success: false, message: error.message, stack: error.stack })
    }
}

export const activate = async (req, res) => {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "user not found" })
    }
    user.isActivate = true;
    await user.save();
    res.status(200).json({ success: true, message: "user activated successfully" })
}

export const sendOtp = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (user) return next(new Error("user already exists", { cause: 400 }))


    const otp = randomString.generate({ length: 5, charset: "alphanumeric" });
    const otbObj = await OTP.create({ email, otp });
    await sendEmail(email, "send otp for activate account", otp);
    res.status(200).json({ success: true, message: "otp sent successfully" })

}


export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("user not found", { cause: 400 }))


    const otp = randomString.generate({ length: 5, charset: "alphanumeric" });
    const otbObj = await OTP.create({ email, otp });
    await sendEmail(email, "send otp for reset password", otp);
    res.status(200).json({ success: true, message: "otp sent successfully" })
}


export const resetPassword = async (req, res, next) => {
    // email passord confirmed password ,otp
    const { email, password, confirmedPassword, otp } = req.body;
    // find email
    const user = await User.findOne({ email });
    if (!user) return next(new Error("user not found", { cause: 400 }))
    // fint otp
    const otpModel = await OTP.findOne({ email, otp });
    if (!otpModel) return next(new Error("otp not found", { cause: 400 }))
    // compare between password and confirmed password
    if (password !== confirmedPassword) return next(new Error("passwords not match", { cause: 400 }))
    //update
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    res.status(200).json({ success: true, message: "password reset successfully" })
}

export const refreshToken = async (req, res, next) => {
    const { refresh_token } = req.body
    const { email } = jwt.verify(refresh_token, process.env.JWT_SECRET_KEY_REFRESH)
    const user = await User.findOne({ email })
    if (!user) return next(new Error("user not found", { cause: 400 }))
    const access_token = await jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY_ACCESS, { expiresIn: "1d" })
    res.status(200).json({ success: true, message: "user logged in successfully", access_token })
}


export const loginGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: "665000740304-maeni7httfg3p6agv6n5g47rbrfrhuji.apps.googleusercontent.com",  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        return payload
    }
    const payLoad = await verify();
    const { email_verified, email, name, picture } = payLoad;
    console.log(email_verified);
    if (!email_verified) return next(new Error("email not verified", { cause: 400 }))
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, userName: name, profileImage: picture, provider: provider.google });
    }
    if (user.provider != provider.google) {
        return next(new Error("you are using another provider", { cause: 400 }))
    }
    user.isActivate = true;
    await user.save();
    const token = await jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY_ACCESS, { expiresIn: "1d" })
    res.status(200).json({ success: true, message: "user logged in successfully", token })
}

export const profilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const userId = req.user.id;

        const key = await s3BucketService.uploadFile(
            req.file,// file
            "online/user/profilePic", // path
            userId // path
        );

        const user = await User.findById(userId);

        user.profileImage = key;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: {
                key,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const coverPics = async (req, res, next) => {
    try {
        // req.files | req.file
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }
        const userId = req.user.id;

        const uploadedFiles = await s3BucketService.uploadFiles(
            files,
            "online/user/coverPic",
            storageTypes.memory, // أو storageTypes.memory
            userId
        );

        const user = await User.findById(userId);
        user.coverPics = uploadedFiles;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Cover images uploaded successfully",
            data: uploadedFiles,
        });
    } catch (error) {
        next(error);
    }
};


export const uploadUserMedia = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await s3BucketService.uploadLargeFile(
      file,
      "online/user/media",
      storageTypes.disk // أو memory حسب multer
    );

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const getFile = async (req, res, next) => {
  try {
    const { key } = req.params;
// encodeURIComponent(key)
    const data = await s3BucketService.getFile(key);

    res.setHeader("Content-Type", data.ContentType);

    data.Body.pipe(res); // stream مباشرة للـ client
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.body; // أو req.params حسب اختيارك

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Key is required",
      });
    }

    const userId = req.user.id;

    await s3BucketService.deleteFile(key);

    const user = await User.findById(userId);

    if (user.profileImage === key) {
      user.profileImage = null;
    }

    if (Array.isArray(user.coverPics)) {
      user.coverPics = user.coverPics.filter(
        (item) => item !== key
      );
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getUploadUrl = async (req, res, next) => {
  try {
    const file = req.body; 
    // هنستخدم fake file (بس علشان نجيب الاسم والميم تايب)

    const result = await s3BucketService.getUploadFilePreSignedUrl(
      {
        originalname: req.body.fileName,
        mimetype: req.body.mimetype,
      }
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};