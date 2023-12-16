
import nodemailer from "nodemailer";

async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.SEND_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `T_Shop" <${process.env.SEND_EMAIL}>`,
        to, 
        subject, 
        html, 
    });
    
}


export default sendEmail;