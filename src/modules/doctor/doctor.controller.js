import doctorModel from "../../../DB/model/doctor.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";



export const signup=async(req,res,next)=>{
    const {email,password}=req.body
    const user=await doctorModel.findOne({email})
    if (user) {
        return next(new Error( "email already exists", { cause: 400 })); 
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
     req.body.password=hashedPassword
    const createUser = await doctorModel.create(req.body);
    return res.status(201).json({ message: "success", createUser });
 }

 export const doctorAvailability=async(req,res,next)=>{
    const _id =req.params.id
    const doctor=await doctorModel.findOne({_id,isDeleted:false})
    if (!doctor) {
        return next(new Error( "thid doctor not exists", { cause: 400 })); 
    }
const availability =doctor.availability
return res.json(availability)
 }