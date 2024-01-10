import { json } from "express";
import appointmentModel from "../../../DB/model/appointment.model.js";
import doctorModel from "../../../DB/model/doctor.model.js";
import moment from 'moment'
import invoiceModel from "../../../DB/model/invoice.model.js";
import medicalReportModel from "../../../DB/model/medicalReports.model.js";
import { pagination } from "../../services/pagination.js";
//user
export const createAppointment = async (req, res, next) => {
    const doctorId = req.params.doctorId;
    const { appointmentDate, appointmentTime, reason } = req.body;
    const startOfDay = moment.utc(appointmentDate).startOf('day');
    const endOfDay = moment.utc(appointmentDate).endOf('day');
    const doctor = await doctorModel.findOne({ _id: doctorId, })
    if(!doctor){
        return next(new Error("this doctor not found", { status: 400 }));
    }
    const test = doctor.availability.filter((ele => ele.Date <= endOfDay && ele.Date >= startOfDay))[0]
  
    if(test.availabilityHouer.length==0){
        return next(new Error("availabilityHouer not found for this doctor", { status: 400 }));
    }
    let houer = test.availabilityHouer.includes(appointmentTime)
    if (houer) {
        const appointment = await appointmentModel.create({
            doctorId,
            patientId: req.user._id,
            appointmentDate,
            appointmentTime,
            reason,
        });
        const index = test.availabilityHouer.indexOf(appointmentTime);
        if (index !== -1) {
            test.availabilityHouer.splice(index, 1);
            await doctor.save();

        }
       return res.status(200).json(appointment);
    }
    return next(new Error("Houer not vailability for this doctor", { status: 400 }));

}

//doctor
//update by appointment_id 
export const updateStatus = async (req, res, next) => {
    const { appointment_id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointment_id },
        { status },
        { new: true }
    ).populate({
        path: 'patientId',
        select: '_id userName email phone address'
    });
    const doctor=await doctorModel.findById(req.user.id)
    if (!appointment) {
        return next(new Error("Appointment not found", { status: 400 }));
    } 
    if (status === 'Completed') {
        const invoice = await invoiceModel.create({
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            Date: new Date(),
            price: doctor.examinationPrice // Assuming 'examinationPrice' is correct
        });
        const medicalReport= await medicalReportModel.create({
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            reportDate: new Date(),
          
        });
       return res.json({ message: "Invoice created", invoice,medicalReport });
  }

}

// done pagination doctor
export const reviewAppointmentScheduled = async (req, res, next) => {
    const doctorId = req.user._id;
    const {skip,limit}=pagination(req.query.page,req.query.limit)
    const appointments = await appointmentModel.find({ doctorId, status: 'Scheduled' }).skip(skip).limit(limit).select('-_id -createdAt -updatedAt -doctorId ').populate({
        path: 'patientId',
        select: '_id  userName email phone address',
    });
    if (!appointments || appointments.length === 0) {
        return next(new Error("No appointments found for this doctor", { cause: 400 }));
    }

    return res.json({ message: 'Appointments found', appointments });
}

// done pagination doctor
export const reviewAllAppointment = async (req, res, next) => {
    const doctorId = req.user._id;
    const {skip,limit}=pagination(req.query.page,req.query.limit)
    const appointments = await appointmentModel.find({ doctorId }).skip(skip).limit(limit).select('-_id -createdAt -updatedAt -doctorId ').populate({
        path: 'patientId',
        select: '_id  userName email phone address',
    });
    if (!appointments || appointments.length === 0) {
        return next(new Error("No appointments found for this doctor", { cause: 400 }));
    }

    return res.json({ message: 'Appointments found', appointments });
}

//user done pagination
export const GetAllAppointments_Patient = async (req, res, next) => {
    const patientId = req.user._id
    const {skip,limit}=pagination(req.query.page,req.query.limit)
    const appointments = await appointmentModel.find({ patientId }).skip(skip).limit(limit).select(' -createdAt -updatedAt -doctorId -__v ').populate({
        path: 'patientId',
        select: '-_id  userName email ',
    }).sort({createAt:-1});


    return res.json(appointments)
}

//user
export const Cancel_Appointment = async (req, res, next) => {
    const { appointmentId } = req.params
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { status: "Cancelled" }, { new: true })
    if (!appointment) {
        return next(new Error("appointments not cancel", { cause: 400 }));
    }
    return res.json(appointment)
}
//doctor
export const appointmentsByDate = async (req, res, next) => {

    const {skip,limit}=pagination(req.query.page,req.query.limit) 
    
    const { date } = req.body
    const doctorId = req.user._id
    const startOfDay = moment.utc(date).startOf('day');
    const endOfDay = moment.utc(date).endOf('day');
    const appointment = await appointmentModel.find({
        doctorId
        , status: "Scheduled"
        , appointmentDate: {
            $gte: startOfDay.toDate(),
            $lt: endOfDay.toDate()
        }
    }).skip(skip).limit(limit).select('-doctorId -appointmentDate -reason -status').populate({
        path: 'patientId',
        select: '_id  userName email phone address',
        }); // Select the appointment time for available slots
    if (!appointment) {
        return next(new Error("appointments not cancel", { cause: 400 }));
    }

    return res.json(appointment)

}