import { Router } from "express";
import { usernameCheck } from "../Services/Authentication";
import { forgotPassword, signIn, signUp } from "../controllers/Authentication";
import { mobileValidation, passwordValidation,mailIdValidation,usernameValidation } from "../middlewares/Authentication";

const router = Router() ;


router.post('/sign-up', mobileValidation, mailIdValidation, usernameValidation, passwordValidation ,usernameCheck, signUp) ;

router.post('/sign-in', usernameValidation, passwordValidation, signIn) ;

router.post('/forgot-password', forgotPassword) ;


export default router ;