import { Router } from "express";
import * as userService from "./user.service.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import validation from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.schema.js"
import { userRole } from "../../DB/models/user.model.js";
import authroization from "../../middlewares/authorization.js";
import { fileUpload, storageTypes } from "../../utils/multer.js";
import { allowFormat } from "../../utils/mulet.validation.js";


const userRouter = Router()

userRouter.post("/register", validation(userValidation.registerSchema), userService.register)


userRouter.post("/login", userService.login)


userRouter.get("/profile", authMiddleware, authroization(userRole.user, userRole.admin), userService.profile)


// userRouter.get("/activate/:token", userService.activate)


userRouter.post("/sendOtp", validation(userValidation.sendOtpSchema), userService.sendOtp)



userRouter.post("/forget-password", validation(userValidation.forgetPassSchema), userService.forgetPassword)

userRouter.post("/reset-password", validation(userValidation.resetPassword), userService.resetPassword)

userRouter.post("/refresh-token", userService.refreshToken, userService.refreshToken)

userRouter.post("/loginGmail", validation(userValidation.loginGamilSchema), userService.loginGmail)

// return middeleware ===> parsing ====> req.file
userRouter.post("/profilePicture", authMiddleware, fileUpload().single("image"), userService.profilePicture)

//req.files
userRouter.post("/coverPics", authMiddleware, fileUpload().array("images", 3), userService.coverPics)

userRouter.post("/upload-media", fileUpload(storageTypes.disk, allowFormat.pdf).single("file"), userService.uploadUserMedia);

userRouter.get("/file/:key", userService.getFile);

userRouter.delete("/file",authMiddleware ,userService.deleteFile);

userRouter.post("/presigned-upload", userService.getUploadUrl);
export default userRouter