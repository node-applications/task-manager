/**
 * middleware module takes three params : req, res, next
 * here next means next step. If one calls next(), program jumps to next step
 * in below case it jumps to request processing
 */

const jsonwebtoken = require('jsonwebtoken');

const userModel = require('../models/usermodel');
const auth = async (req, res, next) => {

    
    try {
        const token = req.header('Authorization').replace('Bearer ','');
       
        // If token expires throws exception
        const decode = jsonwebtoken.verify(token, process.env.MYSECRETKEY);

        console.log(decode);
        // const userString = await redisGet(decode._id);
        // let user = null;

        // Check if user is in cache
        //TODO : cache will return json object not the user model instance
        // hence logout all wont work.
        // It must be used in read operation only.

        // if(userString){
        //     user = JSON.parse(userString);
        //     console.log(`Found user in cache ${userString}`);
        // }else{
        //     console.log(`User not in cache ${decode._id}`);
        //     user = await userModel.findOne({
        //         _id : decode._id,
    
        //         // following is the path which comes with schema
        //         // TODO : explore paths
        //         'tokens.token' : token
        //     });

            
        //     redisSet(decode._id, JSON.stringify(user));
        // }

        const user = await userModel.findOne({
            _id : decode._id,

            // following is the path which comes with schema
            // TODO : explore paths
            'tokens.token' : token
        });

        if (!user) {
            throw new Error({error : 'Token is not valid'});
        }
        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        console.log(e);
        res.status(401).send({error : 'Please authenticate'});

        //TODO : remove token from the user db


    }


};


module.exports = auth;