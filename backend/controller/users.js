import mongoose from "mongoose";
import {} from "dotenv/config";
import { User } from "../models/users.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
     const {  ids } = req.body;

     try {
          const users = await User.find(ids?{_id:ids}:{});
          return res.json(users);
     } catch (error) {
          return res.status(500).send(`Error:${error}`);
     }
};

export const createUser = async (req, res) => {
     const { name, email, password } = req.body;

     try {
          let responseUser = await User.create({ name, email, password});
          return res.status(200).json({message:"Registered"});
     } catch (error) {
          return res.status(200).json({message:"error",error:error});
     }
};
export const followUser = async (req, res) => {
     const { followee } = req.body;
     if(!followee) return res.status(200).json({message:"Followee not provided"})
     const  follower  = req.user.id;
     try {
          let responseFollower = await User.findByIdAndUpdate({_id:follower},{$push:{followings:followee}},{new: true});
          let responseFollowee = await User.findByIdAndUpdate({_id:followee},{$push:{followers:follower}},{new: true});

          return res.status(200).json(responseFollower);
     } catch (error) {
          return res.status(200).json(error.message);
     }
};
export const unfollowUser = async (req, res) => {
     const { followee } = req.body;
     if(!followee) return res.status(200).json({message:"Followee not provided"})
     const  follower  = req.user.id;
     try {
          let responseFollow = await User.findByIdAndUpdate({_id:follower},{$pull:{followings:followee}},{new: true});
          let responseFollowee = await User.findByIdAndUpdate({_id:followee},{$pull:{followers:follower}},{new: true});

          return res.status(200).json(responseFollow);
     } catch (error) {
          return res.status(200).json(error.message);
     }
};
export const loginUser = async (req, res) => {

     const { email, username, password } = req.body;

     // Check if a token is present and is valid -> RETURN "Authenticated"
     const authHeader = req.headers['accesstoken'];
     const token = authHeader && authHeader.split(" ")[0];
     if (token) {
          try {
               const tokenIsValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
               const user = await User.findOne({_id:tokenIsValid.id});
               return tokenIsValid && res.status(200).json({user, message: "Authenticated" });
          } catch (error) {
               return res.status(200).json({ message: error.message });
          }
     }

     if (!email) return res.status(400).json({ message: "Please enter a email." });
     if (!password) return res.status(400).json({ message: "Please enter a password." });

     try {
          /**
           * Search for the user with the email / username in the database.
           * If the user doesn't exists -> RETURN "Invalid credentials."
           * Compare the supplied password with the hashed password.
           * If the passwords match -> RETURN "Authenticated", JWT TOKEN, USER
           * Else RETURN "Invalid credentials."
           */
          const user = await User.findOne(email ? { email: email } : { username: username });
          if (!user) return res.status(200).json({ message: "Invalid credentials." });
          if (await compare(password, user.password)) {
               // login successful -> create a new JWT
               const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
               return res.json({ message: "Authenticated", user, accessToken });
          } else return res.json({ message: "Invalid credentials." });
     } catch (error) {
          return res.status(500).json(error.message);
     }
};
