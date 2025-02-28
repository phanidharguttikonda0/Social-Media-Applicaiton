import { Router } from "express";
import { AuthorizationCheck } from "../middlewares/Authorization";
import { createStory, deleteStory, getStories, getViews, getViewsCount, postView } from "../controllers/Stories";

const router = Router() ;

router.post('/create-story', AuthorizationCheck, createStory) ;

router.post('/delete-story',AuthorizationCheck, deleteStory) ;

router.get('/get-views-count:storyId', AuthorizationCheck, getViewsCount) ;

router.get('/get-views:storyId', AuthorizationCheck, getViews) ;

router.get('/get-stories', AuthorizationCheck, getStories) ;

router.post('/post-view:storyId', AuthorizationCheck, postView) ;

export default router ;