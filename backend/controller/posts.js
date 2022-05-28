import mongoose from "mongoose";
import {} from "dotenv/config";
import {User} from "../models/users.js";
import {hash, compare} from "bcrypt";
import jwt from "jsonwebtoken";
import {Post} from "../models/posts.js";

export const createPost = async (req, res) => {
    const {post} = req.body;
    const author = req.user.id;
    const createdOn = new Date().valueOf()
    try {
        let responsePost = await Post.create({post: post, author: author,createdOn:createdOn});
        let reponseUser = await User.findByIdAndUpdate(
            {_id: author},
            {$push: {posts: responsePost._id}}
        );
        return res.status(200).json({message: "Post tweeted"});
    } catch (error) {
        return res.status(200).json(error.message);
    }
};
export const getMyPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        let responseUser = await User.findById(userId);
        let responsePost = await Post.find({'_id': { $in: responseUser.posts}}).populate('author','name').sort({createdOn:-1})
        return res.status(200).json(responsePost);
    } catch (error) {
        return res.status(200).json(error.message);
    }
};

export const getPosts=async (req,res)=>{
    const userId = req.user.id;

    try {
        let responseUser = await User.findById(userId);
        let responsePost = await Post.find({'author': { $in: responseUser.followings}}).populate('author','name').sort({createdOn:-1})
        return res.status(200).json(responsePost);
    } catch (error) {
        return res.status(200).json(error.message);
    }
}