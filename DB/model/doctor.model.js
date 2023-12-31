import mongoose, { Schema, model } from "mongoose";
const doctorSchema = new Schema({
    userName: {
        type: String,
        requierd: true
    },
    examinationPrice: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        requierd: true,
    },
    description: {
        type: String,
        requierd: true
    },
    image: {
        type: Object,
    }
    , address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],
    },
    patientReviews: {
        type: String,
    },
    availability: [{
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        startHour: {
            type: String,
            required: true
        },

        endHour: {
            type: String,
            required: true
        },
        availabilityHouer: {
            type: [String],
            default: [],
        }
        ,
        isActive: {
            type: Boolean,
            default: true,
            enum: [true, false],
        },
        Date: {
            type: Date,
            requierd: true
        }

    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    sendCode: {
        type: String,
        default: null
    },
    range: {
        type: Number,
        requierd: true
    }

}, { timestamps: true })

const doctorModel = mongoose.models.Doctor || model('Doctor', doctorSchema);
export default doctorModel

