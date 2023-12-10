import { userModels } from "../models/userModel.js";
import 'dotenv/config'
import jwt from "jsonwebtoken"
import transporter from "../configs/emailConfig.js";

class UserController {
    static signup = async (req, res) => {
        const { name, email, password, password_confirmation } = req.body;
        if (name && email && password && password_confirmation) {
            const user = await userModels.findOne({ email: email })
            if (user) {
                return res.status(401).json({ message: "email already registered" })
            }
            else {
                if (password == password_confirmation) {
                    const doc = new userModels({
                        name,
                        email,
                        password
                    })
                    await doc.save()
                    const saved_user = await userModels.findOne({ email })
                    //generate jwt token 
                    const token = jwt.sign({ userID: saved_user.name },
                        process.env.JWT_SECRET_KEY, { expiresIn: '60m' }
                    )
                    return res.status(200).json({ message: "successfully inserted", token: token })
                } else {
                    return res.status(401).json({ message: "password and confirm password is not matched" })
                }
            }

        } else {
            res.status(401).json({ message: "All fields are required" })
        }
    }
    static userLogin = async (req, res) => {
        const { email, password } = req.body
        const user = await userModels.findOne({ email: email })
        if (user) {
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '60m' })
            if (user.password == password) {
                return res.status(201).json({ message: "Succesfull Login", user, token })
            } else {
                return res.status(401).json({ message: "Invalid Password" })
            }
        } else {
            return res.status(401).json({ message: "Invalid User Login" })
        }
    }
    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                return res.status(401).json({ message: "not match password and confirmation password" })
            } else {
                console.log(req.user, "user")
                await userModels.findByIdAndUpdate(req.user._id, { $set: { password: password } })
                res.status(201).json({ message: "succesfull in password change" })
            }
        } else {
            res.status(401).json({ message: "all fields are required" })
        }
    }
    static loogedUser = async (req, res) => {
        res.send({ "user": req.user })
    }
    static sendUserPasswordResetMail = async (req, res) => {
        const { email } = req.body
        if (email) {
            const user = await userModels.findOne({ email })
            if (user != null) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" })
                console.log("click on it to reset password")
                //send email
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM, // sender address
                    to: user.email, // list of receivers
                    subject: "sanjay rest link", // Subject line
                    html: `<a>click here to reset your password</a>`, // html body
                });
                res.status(201).json({ message: "email sent successfully", info })
            } else {
                res.status(401).json({ message: "email not exist" })
            }
        } else {
            res.status(401).json({ "status": "failed", "message": "email field is required" })
        }
    }
    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body;
        const { id, token } = req.params
        const user = await userModels.findById(id)
        const new_token = user._id + process.env.JWT_SECRET_KEY;
        try {
            jwt.verify(token, new_token)
            if (password && password_confirmation) {
                if (password == password_confirmation) {
                    await userModels.findByIdAndUpdate(user._id, { $set: { password } })
                    res.status(200).json({ message: "successfully password changed" })

                } else {
                    res.status(401).json({ message: "password and password confirmation is not same" })

                }
            }
            else {
                res.status(401).json({ message: "All fields requires" })

            }
        } catch (err) {
            console.log("error ", err)
            res.status(401).json({ message: "error in password change" })
        }
    }
}

export default UserController