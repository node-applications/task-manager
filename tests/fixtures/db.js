const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userModel = require('../../src/models/usermodel');
const userModel = require('../../src/models/taskmodel');

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


