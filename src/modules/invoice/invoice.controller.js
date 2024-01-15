import appointmentModel from "../../../DB/model/appointment.model.js";
import invoiceModel from "../../../DB/model/invoice.model.js"
import Excel from 'exceljs';
import moment from 'moment'

//doctor
export const getallInvoice_Doctor = async (req, res) => {
    const doctorId = req.user._id
    const invoice = await invoiceModel.find({ doctorId, isDeleted: false }).sort({ createdAt: -1 }).populate({
        path: 'patientId',
        select: " _id userName"
    })
    if (!invoice) {
        return next(new Error("invoice not found", { status: 400 }));
    }
    return res.json(invoice)
}

//doctor
export const updatePriceOrStatus = async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const { price, status } = req.body;
    const updateFields = {};
    if (price !== undefined) {
        updateFields.price = price;
    }
    if (status !== undefined) {
        updateFields.status = status;
    }

    const invoice = await invoiceModel.findOneAndUpdate(
        { _id: invoice_id },
        updateFields,
        { new: true }
    ).populate({
        path: 'patientId',
        select: '-_id userName'
    });

    if (!invoice) {
        return next(new Error("Invoice not updated", { status: 400 }));
    }

    return res.json(invoice);
}

//doctor
export const printInvoice = async (req, res) => {
    const invoice_id = req.params.invoice_id;

    const invoice = await invoiceModel.find({ _id: invoice_id }).populate({
        path: 'patientId',
        select: '_id  userName'
    }).populate({
        path: 'doctorId',
        select: '_id userName'
    });;

    const date = new Date();
    const startOfDay = moment.utc(date).startOf('day');
    const endOfDay = moment.utc(date).endOf('day');
    const appointment = await appointmentModel.find({
        doctorId: invoice[0].doctorId._id, patientId: invoice[0].patientId._id, status: "Completed"
        , appointmentDate: {
            $gte: startOfDay.toDate(),
            $lte: endOfDay.toDate()
        }
    })
    if (!appointment) {
        return next(new Error("appointments not cancel", { cause: 400 }));
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('./print.xlsx');
    const mainWorksheet = workbook.getWorksheet('Sheet1');
    mainWorksheet.getCell('C4').value =  invoice[0].patientId.userName
    mainWorksheet.getCell('C5').value = invoice[0].doctorId.userName
    mainWorksheet.getCell('C6').value = appointment[0].appointmentDate
    mainWorksheet.getCell('C7').value = appointment[0].appointmentTime
    mainWorksheet.getCell('C8').value =  invoice[0].price

    await workbook.xlsx.writeFile('template.xlsx');
    return res.json({ message: "Excel file created successfully." });
}

//doctor 
export const cancelInvoice = async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const invoice = await invoiceModel.findOneAndUpdate(
        { _id: invoice_id },
        { isDeleted: true },
        { new: true }
    );
    if (!invoice) {
        return next(new Error("invoice not deleted", { status: 400 }));
    }
    return res.json(invoice);
}
//user
export const getallInvoice_User = async (req, res) => {
    const patientId = req.user._id
    const invoice = await invoiceModel.find({ patientId }).sort({ createdAt: -1 })
    if (!invoice) {
        return next(new Error("invoice not found", { status: 400 }));
    }
    return res.json(invoice)
}


