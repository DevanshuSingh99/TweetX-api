import mongoose from "mongoose";
import validator from "validator";
import { hash, compare } from "bcrypt";

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          lowercase:true,
          required: [true, "Name is required."],
          trim: true,
          minlength: [3, "Name is too short."],
          maxlength: [100, "Name is too long."],
          validate: {
               validator: function (name) {
                    return !/[^a-zA-z0-9 _]/.test(name);
               },
               message: "Name should only contain alpha-numeric characters [a-z][A-Z][0-9] SPACE UNDERSCORE",
          },
     },
    
     email: {
          type: String,
          lowercase:true,
          required: [true, "Email is required."],
          minlength: [5, "Email is too short."],
          maxlength: [100, "Email is too long."],
          trim: true,
          unique: [true, "Email is already registered."],
          validate: {
               validator: function (email) {
                    return validator.isEmail(email);
               },
               message: "Email is invalid.",
          },
     },
     password: {
          type: String,
          trim: true,
          required: [true, "Password is required."],
          minLength: [8, "Password is too short."],
          maxlength: [64, "Password is too long."],
          validate: {
               validator: function (password) {
                    return validator.isStrongPassword(password, {
                         minLength: 8,
                         minLowercase: 0,
                         minUppercase: 0,
                         minNumbers: 0,
                         minSymbols: 0,
                    });
               },
               message: "Password is weak.",
          },
     },
     posts: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref:'Post'
     }],
     followings: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref:'User'
     }],
     followers: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref:'User'
     }],
     
     
});


userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     this.password = await hash(this.password, 10);
     next();
});

export const User = mongoose.model("User", userSchema);