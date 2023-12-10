import express from "express"
import UserController from "../controllers/userControllers.js";
import userAuth from "../middlewares/authMiddleware.js";
const router = express.Router();
router.use('/changePassword', userAuth)
router.use('/user', userAuth)
router.post('/registration', UserController.signup)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email',UserController.sendUserPasswordResetMail)
router.post('/reset-password/:id/:token',UserController.changeUserPassword)
//protected routes
router.post('/changePassword', UserController.changeUserPassword)
router.post('/user', UserController.loogedUser)

export default router