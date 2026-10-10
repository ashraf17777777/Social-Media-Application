import joi from "joi";




// schema
const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    age: joi.number().min(18).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmedPassword: joi.ref('password'),
    skills: joi.array().items(joi.object({ frontend: joi.string().required() })).required(),
}).required();

// validation that  compare between data and schema
let result = schema.validate(person, { abortEarly: false })
console.log(result)