import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
export const singnUp=async(req,res,next)=>{
const {userName,email,password,phone,address}=req.body
const user=await userModel.findOne({email})
if (user) {
    return next(new Error( "email already exists", { cause: 400 })); 
}
const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
const token = jwt.sign({ email }, process.env.EMAIL_CONFIRM_KEY);
await sendEmail(email, 'Confirm Email',`<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify</a>`);
const createUser = await userModel.create({ userName, email, password: hashedPassword,address,phone});
return res.status(201).json({ message: "success", createUser });
}
