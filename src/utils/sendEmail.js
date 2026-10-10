import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import { generateTemplate } from "./templateHtml.js"

export const sendEmail = async (email, subject, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "davidosamamilad@gmail.com",
            pass: "kkgy gtkn jsbk sppm"
        },
    })
    // const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY)
    // const link = `http://localhost:3001/user/activate/${token}`

    const info = await transporter.sendMail({
        from: '"Back End Team" <davidosamamilad@gmail.com>', // sender address
        to: email, // list of recipients
        subject, // subject line
      
        html: generateTemplate(otp), // HTML body
    });
}
export default sendEmail