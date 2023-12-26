import doctorModel from "../../../DB/model/doctor.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

import appointmentModel from "../../../DB/model/appointment.model.js";
import moment from 'moment'


export const signup = async (req, res, next) => {
    const { email, password } = req.body
    const user = await doctorModel.findOne({ email })
    if (user) {
        return next(new Error("email already exists", { cause: 400 }));
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
    req.body.password = hashedPassword
    const createUser = await doctorModel.create(req.body);
    return res.status(201).json({ message: "success", createUser });
}


export const doctorAvailability = async (req, res, next) => {
    const _id = req.params.id
    const doctor = await doctorModel.findOne({ _id,isDeleted: false, status: 'Active' })
    if (!doctor) {
        return next(new Error("this doctor not exists", { cause: 400 }));
    }
    const availability = doctor.availability
    const arrayWithoutDate = availability.map(ele => ({
        day: ele.day,
        startHour: ele.startHour,
        endHour: ele.endHour
      }));
   
 return res.json(arrayWithoutDate)

}

