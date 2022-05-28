import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
     post: {
          type: String,
          lowercase:true,
          required: [true, "Post is required."],
          trim: true,
          maxlength: [250, "Post is too long."],
     },
     likes: {
         default:[],
          type: Array,
          trim:true,
     },
     author: {
         required:[true, "Author id is required."],
          type: mongoose.SchemaTypes.ObjectId,
          ref:"User"
     },
     createdOn: {
          type: String,
     },
     
     
});


export const Post = mongoose.model("Post", postSchema);