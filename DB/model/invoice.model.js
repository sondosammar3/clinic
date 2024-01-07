import mongoose , { Schema, model ,Types} from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    doctorId: {
        type:Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },   
    Date:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending',
    },
    price:{
        type:Number,
        required:true
    },
}, { timestamps: true });

const invoiceModel =mongoose.models.Invoice|| mongoose.model('Invoice', invoiceSchema);

export default invoiceModel;