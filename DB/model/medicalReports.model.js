import mongoose , { Schema, model ,Types} from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
    doctorId: {
        type: Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type:Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportDate: {
        type: Date,
        required: true
    },
    reportText: {
        type: String,
   
    },
    attachments: 
        {
            type: Object
        }
    , 
    isDeleted:{
        type:Boolean,
        default:false,
        enm:[true,false]
    }
}, 
{ timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

medicalReportSchema.virtual('MedicalReport', {
    ref: 'User',
    localField: 'patientId',
    foreignField: '_id',
    
    });

const medicalReportModel =mongoose.models.MedicalReport|| mongoose.model('MedicalReport', medicalReportSchema);

export default medicalReportModel;