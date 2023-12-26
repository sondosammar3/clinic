import mongoose, { Schema, model, Types } from 'mongoose';

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
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    status:{
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

appointmentSchema.virtual('user', {
    ref: 'User', 
    localField: 'patientId',
    foreignField: '_id',

});
const appointmentModel = model('Appointment', appointmentSchema);

export default appointmentModel;