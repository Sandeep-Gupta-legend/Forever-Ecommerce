import express from 'express';
import { registerUser, loginUser,adminLogin } from '../controller/userController.js';
const userRouter = express.Router();
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/adminlogin',adminLogin);
export default userRouter;