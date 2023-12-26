import mongoose ,{ Schema,model } from 'mongoose';

const bookedAppointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    bookedHour: {
        type: String,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
});

const BookedAppointment =mongoose.models.BookedAppointment|| mongoose.model('BookedAppointment', bookedAppointmentSchema);

module.exports = BookedAppointment;