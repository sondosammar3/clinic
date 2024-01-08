import invoiceModel from "../../../DB/model/invoice.model.js"


//doctor
export const getallInvoice_Doctor=async(req,res)=>{
    const doctorId=req.user._id
    const invoice=await invoiceModel.find({doctorId,isDeleted:false}).sort({createdAt:-1}).populate({
        path:'patientId',
        select:" _id userName"
    })
    if(!invoice){
        return next(new Error("invoice not found", { status: 400 }));
    }
    return res.json(invoice)
} 

//doctor
export const updatePriceOrStatus=async(req,res)=>{
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
export const printInvoice=async(req,res)=>{
    return res.json("jj")
}

//doctor 
export const cancelInvoice=async(req,res)=>{
    const invoice_id = req.params.invoice_id; 
    const invoice = await invoiceModel.findOneAndUpdate(
        { _id: invoice_id },
        { isDeleted:true },
        { new: true }
    );
    if(!invoice){
        return next(new Error("invoice not deleted", { status: 400 }));
    }
    return res.json(invoice);
}
//user
export const getallInvoice_User=async(req,res)=>{
    const patientId=req.user._id
    const invoice=await invoiceModel.find({patientId}).sort({createdAt:-1})
    if(!invoice){
        return next(new Error("invoice not found", { status: 400 }));
    }
    return res.json(invoice)
}


