import express from "express";
const router = express.Router();
import {auth} from '../middleware/authentication.js'

import { getUsers, createUser, loginUser ,followUser,unfollowUser} from "../controller/users.js";

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/getUsers", getUsers);
router.post("/follow",auth, followUser);
router.post("/unfollow",auth, unfollowUser);


export default router;
