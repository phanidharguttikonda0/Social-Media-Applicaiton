import { Router } from "express";
import { AuthorizationCheck } from "../middlewares/Authorization";
import { deleteNotification, getNotifications, searchUsername } from "../controllers/OtherRoutes";

const router = Router() ;

router.get('/get-notifications', AuthorizationCheck, getNotifications) ;

router.delete('/delete-notification', AuthorizationCheck, deleteNotification) ;

router.get('/search-user:username', AuthorizationCheck, searchUsername) ;


export default router ;