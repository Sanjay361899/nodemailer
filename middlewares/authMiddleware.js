import jwt from "jsonwebtoken"
import { userModels } from "../models/userModel.js";
var userAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers
    if (authorization && authorization.startsWith(`Bearer`)) {
        token = authorization.split(' ')[1]
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await userModels.findById(userID).select('-password')
        next()
    } else {
        console.log("not autherized")
        res.status(401).json({ message: "not autherized" })
    }
}
export default userAuth