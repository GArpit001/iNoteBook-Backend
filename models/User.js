import mongoose from "mongoose";
import { Schema } from "mongoose";


const UserSchema = new Schema({
        fname : {
            type : String,
            required : true
        },
        lname : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        date : {
            type : Date,
            default : Date.now
        }
});

export const User = mongoose.model("user" , UserSchema)