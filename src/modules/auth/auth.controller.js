import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import sendEmail from "../../services/email.js";
import { customAlphabet, nanoid } from "nanoid";
import doctorModel from "../../../DB/model/doctor.model.js";

export const singnUp = async (req, res, next) => {
    const { userName, email, password, phone, address } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
        return next(new Error("email already exists", { cause: 400 }));
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
    const token = jwt.sign({ email }, process.env.EMAIL_CONFIRM_KEY);
    await sendEmail(email, 'Confirm Email', `<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify</a>`);
    const createUser = await userModel.create({ userName, email, password: hashedPassword, address, phone });
    return res.status(201).json({ message: "success", createUser });
}


export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.EMAIL_CONFIRM_KEY)
    if (!decoded) {
        return next(new Error("invalid token", { cause: 400 }));
    }

    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true }, { timestamps: true });
    if (!user) {
        return next(new Error("not verified or your email is already verified", { cause: 404 }));
    }
    return res.status(200).json({ message: "your email is verified" });
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    const doctor = await doctorModel.findOne({ email })
    const generateTokens = (userData) => {
        const token = jwt.sign({ id: userData._id, role: userData.role, status: userData.status }, process.env.LOGIN_SECRET);
        const refreshToken = jwt.sign({ id: userData._id, role: userData.role, status: userData.status }, process.env.LOGIN_SECRET, { expiresIn: '30d' });
        return { token, refreshToken };
    };
    if (doctor) {
        const newmatch = await bcrypt.compare(password, doctor.password)
        if (!newmatch) {
            return next(new Error("password not correct", { cause: 400 }));
        }
        doctor.role="Doctor"
        const { token, refreshToken } = generateTokens(doctor);
        return res.status(200).json({ message: "success", token, refreshToken });
    }

    if (user) {
        if (!user.confirmEmail) {
            return next(new Error("Please confirm your email", { cause: 400 }));
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return next(new Error(" password not correct", { cause: 400 }));
        }

        const { token, refreshToken } = generateTokens(user);
        return res.status(200).json({ message: "success", token, refreshToken });
    }

    return next(new Error("Email not found", { cause: 400 }));
}

export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    const user=await userModel.findOne({ email })
  const doctor =await doctorModel.findOne({email})
  const active=user||doctor
    if (!active) {
        return next(new Error("Invalid email", { cause: 404 }));
    }
    let code = customAlphabet('1234567890ABCDabcd', 5);
    code = code();
    active.sendCode=code
    active.save()
    const html = `<h2>code is: ${code} </h2>`;
    await sendEmail(email, "Reset Password", html);
    return res.status(200).json({ message: "success", active });
}

export const forgetPassword = async (req, res, next) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email })
    const doctor =await doctorModel.findOne({email})
    const active=user||doctor
    if (!active) {
        return next(new Error("not register account", { cause: 404 }));
    }
    if (active.sendCode != code) {
        return next(new Error("invalid code", { cause: 404 }));
    }
    let match = bcrypt.compareSync(password, active.password);
    if (match) {
        return next(new Error("The same password, rejected", { cause: 409 }));
    }
    active.password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
    active.sendCode = null;
    active.changePasswordTime = new Date();
    await active.save();
    return res.status(201).json({ message: "success" });
}







/*
import Excel from 'exceljs';
export const printExcel=async(req,res,next)=>{

    const data={
        "userName":"sondos",
        "fullName":"sondosammar",
                "days": [
            {
                "day": "1/11/2023",
                "enterTime": "8:00 AM, 1/11/2023",
                "leaveTime": "4:00 PM, 1/11/2023",
                "hours": "8.00"
            },
            {
                "day": "2/11/2023",
                "enterTime": "8:00 AM, 2/11/2023",
                "leaveTime": "4:00 PM, 2/11/2023",
                "hours": "8.00"
            },
            {
                "day": "3/11/2023",
                "enterTime": "8:00 AM, 3/11/2023",
                "leaveTime": "4:00 PM, 3/11/2023",
                "hours": "8.00"
            },
            {
                "day": "4/11/2023",
                "enterTime": "8:00 AM, 4/11/2023",
                "leaveTime": "4:00 PM, 4/11/2023",
                "hours": "8.00"
            },
         
            {
                "day": "8/11/2023",
                "enterTime": "8:00 AM, 8/11/2023",
                "leaveTime": "4:00 PM, 8/11/2023",
                "hours": "8.00"
            },
            {
                "day": "9/11/2023",
                "enterTime": "8:00 AM, 9/11/2023",
                "leaveTime": "4:00 PM, 9/11/2023",
                "hours": "8.00"
            },
            {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "leaveTime": "4:00 PM, 10/11/2023",
                "hours": "8.00"
            },
            {
                "day": "12/11/2023",
                "enterTime": "8:00 AM, 12/11/2023",
                "leaveTime": "4:00 PM, 12/11/2023",
                "hours": "8.00"
            },
            {
                "day": "13/11/2023",
                "enterTime": "8:00 AM, 13/11/2023",
                "leaveTime": "4:00 PM, 13/11/2023",
                "hours": "8.00"
            },  {
                "day": "1/11/2023",
                "enterTime": "8:00 AM, 1/11/2023",
                "leaveTime": "4:00 PM, 1/11/2023",
                "hours": "8.00"
            },
            {
                "day": "2/11/2023",
                "enterTime": "8:00 AM, 2/11/2023",
                "leaveTime": "4:00 PM, 2/11/2023",
                "hours": "8.00"
            },
            {
                "day": "3/11/2023",
                "enterTime": "8:00 AM, 3/11/2023",
                "leaveTime": "4:00 PM, 3/11/2023",
                "hours": "8.00"
            },
            {
                "day": "4/11/2023",
                "enterTime": "8:00 AM, 4/11/2023",
                "leaveTime": "4:00 PM, 4/11/2023",
                "hours": "8.00"
            },
         
            {
                "day": "8/11/2023",
                "enterTime": "8:00 AM, 8/11/2023",
                "leaveTime": "4:00 PM, 8/11/2023",
                "hours": "8.00"
            },
            {
                "day": "9/11/2023",
                "enterTime": "8:00 AM, 9/11/2023",
                "leaveTime": "4:00 PM, 9/11/2023",
                "hours": "8.00"
            },
            {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "leaveTime": "4:00 PM, 10/11/2023",
                "hours": "8.00"
            },
            {
                "day": "12/11/2023",
                "enterTime": "8:00 AM, 12/11/2023",
                "leaveTime": "4:00 PM, 12/11/2023",
                "hours": "8.00"
            },
            {
                "day": "13/11/2023",
                "enterTime": "8:00 AM, 13/11/2023",
                "leaveTime": "4:00 PM, 13/11/2023",
                "hours": "8.00"
            },  {
                "day": "1/11/2023",
                "enterTime": "8:00 AM, 1/11/2023",
                "leaveTime": "4:00 PM, 1/11/2023",
                "hours": "8.00"
            },
            {
                "day": "2/11/2023",
                "enterTime": "8:00 AM, 2/11/2023",
                "leaveTime": "4:00 PM, 2/11/2023",
                "hours": "8.00"
            },
            {
                "day": "3/11/2023",
                "enterTime": "8:00 AM, 3/11/2023",
                "leaveTime": "4:00 PM, 3/11/2023",
                "hours": "8.00"
            },
            {
                "day": "4/11/2023",
                "enterTime": "8:00 AM, 4/11/2023",
                "leaveTime": "4:00 PM, 4/11/2023",
                "hours": "8.00"
            },
         
            {
                "day": "8/11/2023",
                "enterTime": "8:00 AM, 8/11/2023",
                "leaveTime": "4:00 PM, 8/11/2023",
                "hours": "8.00"
            },
            {
                "day": "9/11/2023",
                "enterTime": "8:00 AM, 9/11/2023",
                "leaveTime": "4:00 PM, 9/11/2023",
                "hours": "8.00"
            },
            {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "leaveTime": "4:00 PM, 10/11/2023",
                "hours": "8.00"
            },
            {
                "day": "12/11/2023",
                "enterTime": "8:00 AM, 12/11/2023",
                "leaveTime": "4:00 PM, 12/11/2023",
                "hours": "8.00"
            },
            {
                "day": "13/11/2023",
                "enterTime": "8:00 AM, 13/11/2023",
                "leaveTime": "4:00 PM, 13/11/2023",
                "hours": "8.00"
            },
            {
                "day": "8/11/2023",
                "enterTime": "8:00 AM, 8/11/2023",
                "leaveTime": "4:00 PM, 8/11/2023",
                "hours": "8.00"
            },
            {
                "day": "9/11/2023",
                "enterTime": "8:00 AM, 9/11/2023",
                "leaveTime": "4:00 PM, 9/11/2023",
                "hours": "8.00"
            },
            {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "leaveTime": "4:00 PM, 10/11/2023",
                "hours": "8.00"
            },
            {
                "day": "12/11/2023",
                "enterTime": "8:00 AM, 12/11/2023",
                "leaveTime": "4:00 PM, 12/11/2023",
                "hours": "8.00"
            },
            {
                "day": "13/11/2023",
                "enterTime": "8:00 AM, 13/11/2023",
                "leaveTime": "4:00 PM, 13/11/2023",
                "hours": "8.00"
            },
        ],
        "totalHours": "96.00",
        "notCorrectChecks": [
            {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }, {
                "day": "10/11/2023",
                "enterTime": "8:00 AM, 10/11/2023",
                "shiftEnd": "1:55 AM, 13/11/2023"
            }
        ],
        "startDuration": "1/11/2023",
        "endDuration": "16/11/2023",
       
    }
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('./f.xlsx');
    const mainWorksheet = workbook.getWorksheet('Sheet1') || workbook.addWorksheet('Sheet1');
    let notCorrectChecksWorksheet = workbook.getWorksheet('Sheet2');
    if (!notCorrectChecksWorksheet) {
        notCorrectChecksWorksheet = workbook.addWorksheet('Sheet2');
    }
    mainWorksheet.getCell('C4').value = data.userName;
    mainWorksheet.getCell('C5').value = data.fullName;
    mainWorksheet.getCell('C7').value = data.startDuration;
    mainWorksheet.getCell('C8').value = data.endDuration;
    mainWorksheet.getCell('C9').value = data.totalHours;

    let daysRow = 13; 
    data.days.forEach(day => {
        copyRowStyle(daysRow, daysRow + 1, mainWorksheet);
        mainWorksheet.getCell(`B${daysRow}`).value = day.day;
        mainWorksheet.getCell(`C${daysRow}`).value = day.enterTime;
        mainWorksheet.getCell(`D${daysRow}`).value = day.leaveTime;
        mainWorksheet.getCell(`E${daysRow}`).value = day.hours;
        daysRow++;
    });
    let notCorrectChecksRow = 4; 
    data.notCorrectChecks.forEach(check => {
        copyRowStyle(notCorrectChecksRow, notCorrectChecksRow + 1, notCorrectChecksWorksheet);
        notCorrectChecksWorksheet.getCell(`B${notCorrectChecksRow}`).value = check.day;
        notCorrectChecksWorksheet.getCell(`C${notCorrectChecksRow}`).value = check.enterTime;
        notCorrectChecksWorksheet.getCell(`D${notCorrectChecksRow}`).value = check.shiftEnd;
        notCorrectChecksRow++;
    });

    await workbook.xlsx.writeFile('filled_template.xlsx');
    return res.json({ message: "Excel file created successfully." });

}
*/

/*
async function copyRowStyle(sourceRowNum, targetRowNum, worksheet) {
    const sourceRow = worksheet.getRow(sourceRowNum);
    const targetRow = worksheet.getRow(targetRowNum);
    sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        targetRow.getCell(colNumber).style = { ...cell.style };
    });
    targetRow.commit();
}*/
