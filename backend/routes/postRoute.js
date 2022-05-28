import express from "express";
const router = express.Router();
import {auth} from '../middleware/authentication.js'

import { createPost,getMyPosts,getPosts} from "../controller/posts.js";

router.post("/", auth,createPost);
router.get("/myposts", auth,getMyPosts);
router.get("/", auth,getPosts);


export default router;
