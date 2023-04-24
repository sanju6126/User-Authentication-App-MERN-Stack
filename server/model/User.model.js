// thi is a database structure
// creating a schema for mongo DB document

import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({   //this is going to define the structure of the document
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String},
    lastName: { type: String},
    mobile : { type : Number},
    address: { type: String},
    profile: { type: String}

});


export default mongoose.model.Users || mongoose.model('User', UserSchema);
// || is used bcz if there already presents a Schema named User then we are allowing it to use that only...
// If there is no Schema named User then we are creating a new Schema named User
// Users is mentioned bcz Mongo DB Database stores the PLURAL form of User Schema(Whatever we provide the name it stores the PLURAL form of it)

//first one is for returning the existing model if presents and second one is to return a new model f the model tis not present
