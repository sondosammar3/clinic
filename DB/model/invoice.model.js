
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
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    price:{
        type:Number,
        required:true
    },
    isDeleted:{
        type: Boolean,
            default: false,
            enum: [true, false],
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

invoiceSchema.virtual('invoice', {
ref: 'User',
localField: 'patientId',
foreignField: '_id',

});
invoiceSchema.virtual('doctor', {
    ref: 'Doctor',
    localField: 'doctorId',
    foreignField: '_id',
    });

const invoiceModel =mongoose.models.Invoice|| mongoose.model('Invoice', invoiceSchema);

export default invoiceModel;