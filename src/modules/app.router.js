
import connectDB from "../../DB/connection.js";
import authRouter from '../modules/auth/auth.router.js'
import { globalErrorHandler } from "../services/errorHandling.js";
import fileUpload from 'express-fileupload';

const initApp=(app,express)=>{
    app.use(fileUpload());
app.use(express.json());
connectDB()

app.use('/auth',authRouter)
app.get('/', (req, res) => res.status(200).json({ message: "welcome" }));
app.use('*', (req, res) => res.status(500).json({ message: "Page not found" }));
app.use(globalErrorHandler);
}

export default initApp

