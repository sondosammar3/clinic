import appointmentModel from "../../../DB/model/appointment.model.js";
import doctorModel from "../../../DB/model/doctor.model.js";
import medicalReportModel from "../../../DB/model/medicalReports.model.js";
import cloudinary from "../../services/cloudinary.js";
import moment from 'moment'
import Excel from 'exceljs';
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const getallmedicalReport_Doctor = async (req, res) => {

    const doctorId = req.user._id

    const medicalReports = await medicalReportModel
        .find({ doctorId, isDeleted: false })
        .sort({ createdAt: -1 })
        .populate({
            path: 'patientId',
            select: '_id userName',
        });
    if (!medicalReports) {
        return next(new Error("medicalReports not found", { status: 400 }));
    }
    return res.json(medicalReports)
}
export const getallmedicalReport_User = async (req, res) => {
    const patientId = req.user._id
    const medicalReports = await medicalReportModel.find({ patientId }).sort({ createdAt: -1 })
    if (!medicalReports) {
        return next(new Error("medicalReports not found", { status: 400 }));
    }
    return res.json(medicalReports)
}

//addTextAndattachments Doctor
export const updateMedicalReport = async (req, res) => {

    const medicalReport_id = req.params.medicalReport_id;
    const { reportText } = req.body;
    const updateFields = {};

    if (req.files) {
        req.body.file = [];
        for (const file of req.files.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                resource_type: 'raw',
                folder: `${process.env.APP_NAME}/url`,
            
            });
            req.body.file.push({ secure_url, public_id });
        }
        updateFields.attachments = req.body.file;
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
export const cancelMedicalReport = async (req, res) => {
    const medicalReport_id = req.params.medicalReport_id;
    const medicalReport = await medicalReportModel.findOneAndUpdate(
        { _id: medicalReport_id },
        { isDeleted: true },
        { new: true }
    );
    if (!medicalReport) {
        return next(new Error("medicalReport not deleted", { status: 400 }));
    }
    return res.json(medicalReport);
}

//
export const printMedicalReport = async (req, res) => {
     const workbook = new Excel.Workbook();
    const filePath = join(__dirname, '../../Template/report.xlsx');
 
    await workbook.xlsx.readFile(filePath);
    const medicalReport_id = req.params.medicalReport_id
    const medicalReport = await medicalReportModel.find({ _id: medicalReport_id }).populate({
        path: 'patientId',
        select: '_id userName'

    })
    const doctor = await doctorModel.findOne({ _id: medicalReport[0].doctorId })
    const date = new Date();
    const startOfDay = moment.utc(date).startOf('day');
    const endOfDay = moment.utc(date).endOf('day');
    const appointment = await appointmentModel.find({
        doctorId: medicalReport[0].doctorId._id, patientId: medicalReport[0].patientId._id, status: "Completed"
        , appointmentDate: {
            $gte: startOfDay.toDate(),
            $lte: endOfDay.toDate()
        }
    }).populate({
        path: 'doctorId',
        select: "_id userName"
    })
    if (!appointment) {
        return next(new Error("appointments not cancel", { cause: 400 }));
    }


   
   
    const mainWorksheet = workbook.getWorksheet('Sheet1');
    mainWorksheet.getCell('C4').value = medicalReport[0].patientId.userName
    mainWorksheet.getCell('C5').value = appointment[0].doctorId.userName
    mainWorksheet.getCell('C6').value = appointment[0].appointmentDate
    mainWorksheet.getCell('C7').value = appointment[0].appointmentTime
    mainWorksheet.getCell('C9').value = medicalReport[0].reportText

    let daysRow = 12;
    medicalReport[0].attachments.forEach(file => {
        copyRowStyle(daysRow, daysRow + 1, mainWorksheet);
        mainWorksheet.getCell(`C${daysRow}`).value = file.secure_url;
        mainWorksheet.getCell(`B${daysRow}`).value = "secure_url";

        daysRow++;
    })
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the appropriate headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${medicalReport[0].patientId._id}-report.xlsx`);
    // Send the buffer in the response
    return res.send(buffer);
}
async function copyRowStyle(sourceRowNum, targetRowNum, worksheet) {
    const sourceRow = worksheet.getRow(sourceRowNum);
    const targetRow = worksheet.getRow(targetRowNum);
    sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        targetRow.getCell(colNumber).style = { ...cell.style };
    });
    targetRow.commit();
}