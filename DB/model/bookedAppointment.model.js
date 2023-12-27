import mongoose, { Schema, model } from 'mongoose';

const bookedAppointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },

    bookedHour: [
        {
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
            appointmentDate: { type: Date, required: true },
            bookedHours: { type: String, required: true },

        }
    ]
},{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

bookedAppointmentSchema.virtual('Doctor', {
    ref: 'Doctor', 
    localField: 'doctorId',
    foreignField: '_id',

});
const BookedAppointmentModel = mongoose.models.BookedAppointment || mongoose.model('BookedAppointment', bookedAppointmentSchema);

export default BookedAppointmentModel;
