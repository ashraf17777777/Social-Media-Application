const authroization = (...roles) => {
    //[admin, user]
    return (req, res, next) => {
  
        // data that come from req || the role you put in the end point 
        if (!roles.includes(req.user.role)) {
            next(new Error("you are not authorized to access this route", { cause: 403 }))
        }
        next()
    }
}

export default authroization