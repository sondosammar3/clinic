import joi from "joi"
export const generalFields={
    email:joi.string().email().required().min(5).messages({
        'string.empty':'email is required',
        'string.email':"plz enter a valid email "
    }),
    password:joi.string().required().min(3).messages({
        'string.empty':'password is required',
    }),
    id:joi.string().pattern(/^[0-9a-f]{24}$/).required(),
    phone:joi.string().pattern(/^[0-9]+$/).min(10).max(15).required()
}

export const validation=(schema)=>{
return (req,res,next)=>{
    const inputsData={...req.body,...req.params,...req.query}
    const validationResult=schema.validate(inputsData,{abortEarly:false})
    if(validationResult.error?.details){
        return res.status(400).json({message:"validation error",validationError:validationResult.error?.details
    })
    }
    next()
}
}
 