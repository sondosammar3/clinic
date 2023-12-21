import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";
import doctorModel from "../../DB/model/doctor.model.js";

export const roles = {
    Admin: 'Admin',
    User: 'User',
    Doctor: 'Doctor'
}

const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return next(new Error("Invalid authorization", { cause: 404 }))
        }
        const token = authorization.split(process.env.BEARERKEY)[1]
        const decoded = jwt.verify(token, process.env.LOGIN_SECRET)
        if (!decoded) {
            return next(new Error("Invalid authorization", { cause: 404 }))
        }
        const user = await userModel.findById(decoded.id).select("userName role changePasswordTime")
        const doctor = await doctorModel.findById(decoded.id).select("userName role changePasswordTime")
        const authenticatedEntity = user || doctor;
        if (!authenticatedEntity) {
            return next(new Error("Not registered account", { cause: 404 }));
        }
        if (!accessRoles.includes(decoded.role)) {
            return next(new Error("Not allowed to you", { cause: 404 }));
        }
        if (parseInt(authenticatedEntity.changePasswordTime?.getTime() / 1000) > decoded.iat) {
            return next(new Error('Expired token, please login again', { cause: 400 }));
        }

        req.user = authenticatedEntity;
        next()
    }
};


export default auth





