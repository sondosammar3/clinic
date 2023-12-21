import mongoose, { Schema,model } from "mongoose";
const doctorSchema = new Schema({
    userName: {
        type: String,
        requierd: true
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
    description:{
type:String,
requierd:true
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
    availability: [ {
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
   } }],
   isDeleted:{
    type:Boolean,
    default: false,
},
sendCode:{
    type:String,
    default:null
},

},{timestamps:true})

const doctorModel = mongoose.models.Doctor || model('Doctor', doctorSchema);
export default doctorModel

