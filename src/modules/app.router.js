
import connectDB from "../../DB/connection.js";
import authRouter from '../modules/auth/auth.router.js'
import { globalErrorHandler } from "../services/errorHandling.js";
import doctorRouter from "./doctor/doctor.router.js";
import appointmentRouter from '../modules/appointment/appointment.router.js'
import invoiceRouter from'../modules/invoice/invoice.router.js'
const initApp=(app,express)=>{
app.use(express.json());
connectDB()
app.use('/doctor',doctorRouter)
app.use('/auth',authRouter)
app.use('/appointment',appointmentRouter)
app.use('/invoice',invoiceRouter)
app.get('/', (req, res) => res.status(200).json({ message: "welcome" }));
app.use('*', (req, res) => res.status(500).json({ message: "Page not found" }));
app.use(globalErrorHandler);
}

export default initApp

