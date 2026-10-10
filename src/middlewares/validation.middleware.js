const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query }// bring the data 
        // schema , data (validate)
        const reults = schema.validate(data, { abortEarly: false });
        if(reults.error){
            const messageList = reults.error.details.map(detail => detail.message);
            return next(new Error(messageList, { cause: 400 }))
        }
       return next()
    }
}


export default validation