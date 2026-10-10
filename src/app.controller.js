import connectDB from "./DB/connection.js";
import userRouter from "./modules/user.module/user.controller.js";

export const bootstrap = async (express, app) => {
    app.use(express.json());
    app.use("/user", userRouter)



    await connectDB()



    app.use((req, res) => { res.status(404).json({ message: "Not Found" }) })


    app.use((err, req, res, next) => {
        const status = err.cause || 500
        res.status(status).json({ success: false, message: err.message, stack: err.stack })
    })
}