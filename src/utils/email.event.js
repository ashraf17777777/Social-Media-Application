import { EventEmitter } from "events";
import sendEmail from "./sendEmail.js";



export const emailEmitter = new EventEmitter()


emailEmitter.on("sendEmail", async(email,subject) => {
    const isSend = await sendEmail(email, subject)
})





