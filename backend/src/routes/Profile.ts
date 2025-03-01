import { Router } from "express";
import {getProfile, editProfile, changePassword, changeMailId, setAccountType} from '../controllers/Profile' ;
import { AuthorizationCheck } from "../middlewares/Authorization";
import { mailIdValidation, nameValidation, passwordValidation, usernameValidation } from "../middlewares/Authentication";
const router = Router() ;


router.post('/',AuthorizationCheck, getProfile) ;

router.post('/edit-profile', AuthorizationCheck,usernameValidation,nameValidation, editProfile) ;

router.post('/change-password', AuthorizationCheck,passwordValidation, changePassword) ;

router.post('/change-MailId', AuthorizationCheck,mailIdValidation, changeMailId) ;

router.post('/set-account-type', AuthorizationCheck,setAccountType) ;

export default router ;