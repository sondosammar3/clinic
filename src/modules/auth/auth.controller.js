import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import sendEmail from "../../services/email.js";
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


export const confirmEmail =async(req,res,next)=>{
    const {token}=req.params
    const decoded=jwt.verify(token, process.env.EMAIL_CONFIRM_KEY)
    if (!decoded) {
        return next(new Error("invalid token", { cause: 400 }));
    }

   const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true },{timestamps:true});
   if (!user) {
    return next(new Error("not verified or your email is already verified", { cause: 404 }));
}
return res.status(200).json({ message: "your email is verified" });
} 


export const signin=async(req,res,next)=>{
    
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if (!user) {
        return next(new Error("email not found", { cause: 400 }));
    }
    if (!user.confirmEmail) {
        return next(new Error("Plz confirm your email", { cause: 400 }));
    }
     const match=await bcrypt.compare(password,user.password)
     if (!match) {
        return next(new Error("data invalid", { cause: 400 }));
    }
    const token =jwt.sign({id:user._id,role: user.role, status: user.status }, process.env.LOGIN_SECRET)
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGIN_SECRET,
        { expiresIn: 60 * 60 * 24 * 30 });
    return res.status(200).json({ message: "success", token, refreshToken });
}
