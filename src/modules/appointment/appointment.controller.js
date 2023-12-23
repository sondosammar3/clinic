import appointmentModel from "../../../DB/model/appointment.model.js";
import doctorModel from "../../../DB/model/doctor.model.js";


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