const express = require('express');
const UserModel = require('../models/usermodel');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');

const sendmail = require('../emails/accounts');

// image manipulator
const sharp = require('sharp');

/*
    Users model operation

    one cannot use await without async.
    This is complicated but u'll understand soon with practice.
    Remember the reject from promise can be caught in try catch

*/

router.post('/Users', async (req, res) => {

    try{

        if(!req.body.password){
            throw new Error({error : 'Authentication value cannot be empty'});
        }
        const user = new UserModel(req.body);
        

        await user.save();

        const token = await user.generateAuthToken();

        // send an email to user email id
        sendmail.sendWelcomeMail( user.email, 
                  user.name
        );

        res.status(200).send({user, token});
    }catch(e){
        console.log('Error', e)
        res.status(500).send(e);
    }

    
    // user.save()
    //     .then((result) => {
    //         res.status(201).send(result);
    //     })
    //     .catch((err) => {
    //         console.log('Error is !!');
    //         console.log(err._message);
    //         res.status(400).send(err);
    //     });
});

// get all users

router.get('/Users', async (req, res) => {

    try{
        const users = await UserModel.find({});
        res.status(200).send(users);
    }catch(e){
        res.status(500).send(e);
    }
});


//login to user
router.post('/User/login', async (req, res) => {

    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,
                              token
                             });
    } catch (e) {
        console.log(e.message);
        res.status(401).send({error: e.message});
    }

});

// get one user

router.get('/Users/me', auth , async (req, res) => {

    try {
        // const user = await UserModel.findById(req.params.id);

        const user = req.user;
        if(!user){
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});


// logout user

router.post('/User/logout', auth , async (req, res) => {
    
    try {
        const user = req.user;
        user.tokens = user.tokens.filter(( token ) => token.token !== req.token);
        
        await user.save();

        res.send();

    } catch (e) {
        res.status(500).send();
    }
});


// logout all user

router.post('/User/logoutAll', auth , async (req, res) => {
    
    try {
        const user = req.user;
        user.tokens = [];
        
        await user.save();

        res.send();

    } catch (e) {
        res.status(500).send();
    }
});

// router.delete('/Users/:id', async (req, res) => {
router.delete('/Users/me', auth , async (req, res) => {

    // anonymous function call practice 
    // though this comnplicated.
    // TODO : Let it be for learning purpose. later change it

    try {
        //const user = await UserModel.findByIdAndDelete(req.params.id);
        const user = req.user;
        await user.delete();
        if(!user){
            return res.status(404).send();
        }

        res.send(user);
        sendmail.sendCancelMail(user.email, user.name);

    } catch (e) {
        res.status(500).send(e);
    }
});

// update one user

// router.patch('/Users/:id', async (req, res) => {
router.patch('/Users/me', auth , async (req, res) => {    

    const allowedFields = ['age', 'name', 'email', 'address', 'password'];
    const updateFields = Object.keys(req.body);

    // every return true if all true else false any one is false
    const isValidFields = updateFields.every((field) => allowedFields.includes(field));

    if(! isValidFields ){
        return res.status(400).send({
            error : 'Invalid Fields'
        });
    }

    try {

        /* Commenting this code since middleware will be bypassed
           for update method below. Better to save explicitly */
        // const user = await UserModel.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     {
        //         new : true,
        //         runValidators : true
        //     }
        // );

        // const user = await UserModel.findById(req.params.id);

        const user = req.user;

        if( !user ){
            return res.status(404).send();
        }

        updateFields.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }

});


// this folder in the destination is inside task-manager folder
// this comes with respect to index.js
// as soon the multer is instantiated the destination folder will be created
// regex101.com is very good to practice javaScript regular expression
// Middleware error comes in html format
// Now if we keep dest here then in the request parameter we won't see file object to do that remove dest
const upload = multer({
    //dest : 'avatar',
    limits : {
        fileSize : 1000000
    },
    fileFilter (req, file, callBack) {
        if (file.originalname.match(/\.(png|jpg|jpeg)$/i)){
            return callBack(undefined, true);
        }
        return callBack(new Error ('Only png and jpg files are allowed'));
    }
});


// Now store images in the db
// To do this convert image to binary data
router.post('/Users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    // req.user.avatar = req.file.buffer;
    /* 
        TODO : currently image is cropped because of resize, so there is a loss of data.
               resize data with whole picture but do not crop it.
    */
    const imageBuffer = await sharp(req.file.buffer).resize({
                                                                width : 250,
                                                                height : 250,
                                                            })
                                .png().toBuffer();
    req.user.avatar = imageBuffer;
    await req.user.save();
    res.send();
},
(error, req, res, next) => {
    res.status(400).send({error : error.message});
 }
);


// Remove the avatar
router.delete('/Users/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
},
(error, req, res, next) => {
    res.status(400).send({error : error.message});
 }
);


// Get the avatar
// TODO : correct this endpoint
router.get('/Users/me/avatar', auth, (req, res) => {

    res.set('Content-Type','image/png');
    res.send(req.user.avatar);
},
(error, req, res, next) => {
    res.status(400).send({error : error.message});
 }
);


// Get the avatar by id
router.get('/Users/:id/avatar', async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.id);

        if(!user){
            throw new Error ('User does not exists')
        }
    
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send({error : e.message});
    }
}
);

module.exports = router;