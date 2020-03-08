const jsonwebtoken = require('jsonwebtoken');

const userModel = require('../models/usermodel');


const auth = async (req, res, next) => {

    
    try {
        const token = req.header('Authorization').replace('Bearer ','');
       
        const decode = jsonwebtoken.verify(token, 'mysecretkeyvm');

        //console.log(decode);
        const user = await userModel.findOne({
            _id : decode._id,
            'tokens.token' : token
        });

        if (!user) {
            throw new Error({error : 'Token is not valid'});
        }
        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({error : 'Please authenticate'});

        //TODO : remove token from the user db


    }


};


module.exports = auth;