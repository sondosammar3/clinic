import doctorModel from "../../../DB/model/doctor.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

import appointmentModel from "../../../DB/model/appointment.model.js";



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
    const doctor = await doctorModel.findOne({ _id, isDeleted: false, status: 'Active' })
    if (!doctor) {
        return next(new Error("this doctor not exists", { cause: 400 }));
    }
    const availability = doctor.availability
    return res.json(availability)
}

export const reviewAppointment = async (req, res, next) => {
    const doctorId = req.user._id;
    const appointments = await appointmentModel.find({ doctorId, status: 'Scheduled' }).select('-_id -createdAt -updatedAt -doctorId ').populate({
        path: 'patientId',
        select: '_id  userName email phone address',
    });
    if (!appointments || appointments.length === 0) {
        return next(new Error("No appointments found for this doctor", { cause: 400 }));
    }

    return res.json({ message: 'Appointments found', appointments });
}

export const updateStatus=async(req,res,next)=>{
    const { appointment_id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointment_id },
        { status },
        { new: true }
    );
    if (!appointment) {
        return next(new Error("Appointment not found", { status: 400 }));
    }

    return res.json(appointment);

}

