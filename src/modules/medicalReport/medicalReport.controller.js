import medicalReportModel from "../../../DB/model/medicalReports.model.js";
import cloudinary from "../../services/cloudinary.js";
export const getallmedicalReport_Doctor=async(req,res)=>{
    
    const doctorId=req.user._id
   
    const medicalReports = await medicalReportModel
            .find({ doctorId, isDeleted: false })
            .sort({ createdAt: -1 })
            .populate({
                path: 'patientId',
                select: '_id userName',
            });
    if(!medicalReports){
        return next(new Error("medicalReports not found", { status: 400 }));
    }
    return res.json(medicalReports)
}
export const getallmedicalReport_User=async(req,res)=>{
    const patientId=req.user._id
    const medicalReports=await medicalReportModel.find({patientId}).sort({createdAt:-1})
    if(!medicalReports){
        return next(new Error("medicalReports not found", { status: 400 }));
    }
    return res.json(medicalReports)
}

//addTextAndattachments Doctor
export const updateMedicalReport=async(req,res)=>{
   
    const medicalReport_id = req.params.medicalReport_id; 
    const { reportText} = req.body;
    const updateFields = {};
 
    if(req.files){
        req.body.file = [];
    for (const file of req.files.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder:`${process.env.APP_NAME}/url` });
            console.log(file)
        req.body.file.push({ secure_url, public_id });
    }
     updateFields.attachments =  req.body.file;
    }

    if (reportText !== undefined) {
        updateFields.reportText = reportText;
    }

        const medicalReport = await medicalReportModel.findOneAndUpdate(
            { _id: medicalReport_id },
            updateFields,
            { new: true }
        ).populate({
            path: 'patientId',
            select: '-_id userName'
        });

        if (!medicalReport) {
            return next(new Error("medicalReport not updated", { status: 400 }));
        }

        return res.json(medicalReport);
 
}

// doctor cancel MedicalReport
export const cancelMedicalReport=async(req,res)=>{
    const medicalReport_id = req.params.medicalReport_id; 
    const medicalReport = await medicalReportModel.findOneAndUpdate(
        { _id: medicalReport_id },
        { isDeleted:true },
        { new: true }
    );
    if(!medicalReport){
        return next(new Error("medicalReport not deleted", { status: 400 }));
    }
    return res.json(medicalReport);
}

//
export const printMedicalReport=async(req,res)=>{
    return res.json("J")
}