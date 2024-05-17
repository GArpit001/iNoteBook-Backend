import mongoose from "mongoose";
import { Schema } from "mongoose";



const NoteSchema = new Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true,
        },
        tag : {
            type : String,
            required : true
        }
});


export const Notes = mongoose.model('note' , NoteSchema)