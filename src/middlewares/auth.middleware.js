
import jwt from "jsonwebtoken"
import User from "../DB/models/user.model.js";

export const authMiddleware = async(req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: "token not found" })
        }
        //[Bearer, token]
        const token = authorization.split(" ")[1];
        const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS);

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        req.user = user
        next()
    } catch (error) {
        res.json({ success: false, message: error.message, stack: error.stack })
    }

}