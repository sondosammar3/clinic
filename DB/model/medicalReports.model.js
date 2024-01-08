import mongoose , { Schema, model ,Types} from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
    doctorId: {
        type: Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type:Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    reportDate: {
        type: Date,
        required: true
    },
    reportText: {
        type: String,
   
    },
    attachments: [String], // Array of file paths or URLs for attachments
}, { timestamps: true });

const medicalReportModel =mongoose.models.MedicalReport|| mongoose.model('MedicalReport', medicalReportSchema);

export default medicalReportModel;