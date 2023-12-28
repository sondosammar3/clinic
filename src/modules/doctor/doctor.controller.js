import doctorModel from "../../../DB/model/doctor.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

import appointmentModel from "../../../DB/model/appointment.model.js";
import moment from 'moment'

export const signup = async (req, res, next) => {
    const { email, password,range,availability} = req.body
    const user = await doctorModel.findOne({ email }) 
    if (user) {
        return next(new Error("email already exists", { cause: 400 }));
    }
    for(let i =0 ;i<availability.length;i++){
        const hoursRange = generateHoursRange(availability[i].startHour, availability[i].endHour, range);
              availability[i].availabilityHouer=hoursRange

    } 
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
    req.body.password = hashedPassword

    const createUser = await doctorModel.create(req.body);
    return res.status(201).json({ message: "success", createUser });
}

export const doctorAvailability = async (req, res, next) => {
    const _id = req.params.id
    const doctor = await doctorModel.findOne({ _id, isDeleted: false, status: 'Active' }).select('-password -status -sendCode -createdAt -updatedAt -isDeleted')
    if (!doctor) {
        return next(new Error("this doctor not exists", { cause: 400 }));
    }
    const availability = doctor.availability
    if (!availability.length) {
        return next(new Error("No future availability found for this doctor", { cause: 400 }))
    }

    return res.json(doctor)
}



function generateHoursRange(startHour, endHour, range) {
    const hours = [];
    let currentTime = moment(startHour, 'HH:mm');//"2023-12-28T18:00:00.000Z"
    const endTime = moment(endHour, 'HH:mm');//"2023-12-28T20:00:00.000Z"

    if (endTime.isBefore(currentTime)) {
        endTime.add(1, 'day'); // Adjust for end time on the next day
    }
    while (currentTime.isBefore(endTime)) {
        hours.push(currentTime.format('HH:mm'));
        currentTime.add(range, 'minutes');
        if (currentTime.format('HH:mm') === '24:00' || currentTime.format('HH:mm') === '00:00') {
            break;
        }
    }

    // Ensure we don't add the end hour if it's the start of the next day
    if (currentTime.format('HH:mm') !== '00:00') {
        hours.push(endHour);
    }

    return hours;
}