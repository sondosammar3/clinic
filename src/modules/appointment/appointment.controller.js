import appointmentModel from "../../../DB/model/appointment.model.js";
import doctorModel from "../../../DB/model/doctor.model.js";
import moment from 'moment'
//user
export const createAppointment=async(req,res,next)=>{
    const doctor_Id=req.params.doctorId
    const {appointmentDate, appointmentTime, reason } = req.body; 
    const doctor = await doctorModel.findById(doctor_Id);

    if (!doctor) {
        return next(new Error( "this doctor not exists", { cause: 400 })); 
    }
    const appointment = await appointmentModel.create({
        doctorId: doctor._id,
        patientId: req.user._id,
        appointmentDate,
        appointmentTime,
        reason,
    });
    return res.json({message:"success",appointment})
}

//doctor
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

//doctor
export const reviewAppointmentScheduled = async (req, res, next) => {
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

//doctor
export const reviewAllAppointment=async (req,res,next)=>{
    const doctorId = req.user._id;
    const appointments = await appointmentModel.find({ doctorId}).select('-_id -createdAt -updatedAt -doctorId ').populate({
        path: 'patientId',
        select: '_id  userName email phone address',
    });
    if (!appointments || appointments.length === 0) {
        return next(new Error("No appointments found for this doctor", { cause: 400 }));
    }

    return res.json({ message: 'Appointments found', appointments });
}

//user
export const GetAllAppointments_Patient=async(req,res,next)=>{
    const patientId=req.user._id
    const appointments = await appointmentModel.find({ patientId }).select(' -createdAt -updatedAt -doctorId -__v ').populate({
        path: 'patientId',
        select: '-_id  userName email ',
    });

   
    return res.json(appointments)
}

//user
export const Cancel_Appointment=async(req,res,next)=>{
   const {appointmentId}=req.params
   const appointment=await appointmentModel.findByIdAndUpdate(appointmentId,{status:"Cancelled"},{new:true})
   if (!appointment) {
    return next(new Error("appointments not cancel", { cause: 400 }));
}
return res.json(appointment)
}
//doctor
export const appointmentsByDate=async(req,res,next)=>{
const {date}=req.body
const doctorId=req.user._id
const startOfDay = moment.utc(date).startOf('day');
const endOfDay = moment.utc(date).endOf('day');
console.log(startOfDay)
console.log(endOfDay)
const appointment = await appointmentModel.find({doctorId
    ,status:"Scheduled"
,   appointmentDate: {
    $gte: startOfDay.toDate(),
    $lt: endOfDay.toDate()
}}).select('-doctorId -appointmentDate -reason -status').populate('user'); // Select the appointment time for available slots
if (!appointment) {
    return next(new Error("appointments not cancel", { cause: 400 }));
}

return res.json(appointment)

}