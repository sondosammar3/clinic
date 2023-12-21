import mongoose, { Schema, model,Types } from 'mongoose';

const appointmentSchema = new Schema({
    doctorId: {
        type: Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String, // could also be a Date type, depending on how you want to handle time
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    }
}, { timestamps: true });

const appointmentModel = model('Appointment', appointmentSchema);

export default appointmentModel;