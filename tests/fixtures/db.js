const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userModel = require('../../src/models/usermodel');
<<<<<<< HEAD
//const taskModel = require('../../src/models/taskmodel');
=======
const userModel = require('../../src/models/taskmodel');
>>>>>>> ab7cbd03e46d6ed8ad4b29f620137852cf9f98d7

// create initial user

const userid = mongoose.Types.ObjectId();

const userOne = {
    _id : userid,
    name : 'mintestuser',
    email : 'mintestuser@yopmail.com',
    password : 'check12345',
    tokens : [
        {
            token : jwt.sign({_id : userid}, process.env.MYSECRETKEY)
        }
    ]
};



module.exports = {
    
    userid,
    userOne,

    async createTestUser () {
        
        try {

            await userModel.deleteMany();
            await new userModel(userOne).save();

        } catch (e) {
            console.log('Error in test user creation', e);
        }
        
        
    }

};


