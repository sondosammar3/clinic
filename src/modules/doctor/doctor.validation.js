import { generalFields } from "../../middleware/validation.js"
import joi from "joi"


export const signup = joi.object({
    userName: joi.string().required(),
    password: generalFields.password,
    email: generalFields.email,
    phone:generalFields.phone,
    specialization:joi.string().required(),
    description:joi.string().required(),
    address:joi.string().required(),
    gender:joi.string().valid('Male', 'Female').insensitive().required(),
    range:joi.number(),
    availability:joi.array().items(
        joi.object({
            day: joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').insensitive().required(),
            startHour: joi.string().required(),
            endHour: joi.string().required(),
            Date: joi.date().greater('now').required(),
            availabilityHouer:joi.array()
        })
    ).required(),

});

export const updateRange=joi.object({
range:joi.number().required()

})