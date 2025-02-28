import { Router } from "express";
import { AuthorizationCheck } from "../middlewares/Authorization";
import { createPost, deleteComment, deletePost, getComments, getLikes, getPosts, postComment, postLike } from "../controllers/Posts";

const router = Router() ;


router.post('/create-post', AuthorizationCheck, createPost) ;

router.post('/delete-post', AuthorizationCheck, deletePost) ;

router.post('/liked:postId', AuthorizationCheck, postLike) ;

router.post('/comment:postId', AuthorizationCheck, postComment) ;

router.post('/delete-comment:commentId', AuthorizationCheck, deleteComment) ;

router.get('/get-comments:postId', AuthorizationCheck, getComments) ;

router.get('/get-likes:postId', AuthorizationCheck, getLikes) ;

router.get('/get-posts', AuthorizationCheck, getPosts) ;

export default router
