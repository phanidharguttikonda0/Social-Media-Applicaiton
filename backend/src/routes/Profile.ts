import { Router } from "express";
import {getProfile, editProfile, changePassword, changeMailId} from '../controllers/Profile' ;
import { AuthorizationCheck } from "../middlewares/Authorization";
const router = Router() ;


router.post('/',AuthorizationCheck, getProfile) ;

router.post('/edit-profile', AuthorizationCheck, editProfile) ;

router.post('/change-password', AuthorizationCheck, changePassword) ;

router.post('/change-MailId', AuthorizationCheck, changeMailId) ;

export default router ;