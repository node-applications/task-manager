const mongoose = require('mongoose');
const userFomatter = require('../Formatter/userformatter');
const jsonwebtoken = require('jsonwebtoken');

const taskModel = require('./taskmodel');

const validator = require('validator');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required:true,
        trim : true
    },

    password : {
        type: String,
        required : true,
        validate (val) {
            if(val.toLowerCase().includes('password')) 
                throw new Error('Password must not contain password');
        },
        trim : true,
        minlength : 8
    },

    age : {
        type : Number,
        default : 0,
        validate (val) {
            if(val < 0) throw new Error('Age cannot be negative');
        }
    },
    address : {
        type : String
    },
    email : {
        type:String,
        required : true,
        trim:true,
        unique:true,
        lowercase : true,
        validate (val) {
            if(!validator.isEmail(val)) throw new Error('Not a valid email');
        }
    },

    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ],

    avatar : {
        type : Buffer
    }
},

{
    // it creates two more fields, one is createdAt and other is updatedAt
    timestamps : true
}
);


// relationship to task model

userSchema.virtual('tasks',{
    ref:'task',
    localField : '_id',
    foreignField : 'author',
});

userSchema.set('toJSON', { virtuals: true });

// Register a method to user instance
// Below is the method will be called by user instance

userSchema.method(
    {
            // here the this is refers to the user instance for which
            // this meyhod is invoked
        generateAuthToken : async function() {
            const user = this;
            const token = jsonwebtoken.sign({
               _id :  user._id
            }, process.env.MYSECRETKEY,
            {
                expiresIn : '1 hour'
            });
            
            user.tokens = user.tokens.concat({ token });

            await user.save();
            return token;
        },

        verifyAuthToken : async function (token) {
                // here the this is refers to the user instance for which
                // this meyhod is invoked
                const user = this;
                try {
                    const decoded = jsonwebtoken.verify(token, process.env.MYSECRETKEY);
                    return decoded;
                } catch (e) {
                    throw new Error({error : 'token validation failed'});
                }
        },

        // getPublicProfile : function () {
        //     const user = this;

        //     const userObject = user.toObject();
            
        //     delete userObject.password;
        //     delete userObject.tokens;
        //     return userObject;
        // }

        // override the toJSON method os model instance
        toJSON : function () {
            const user = this;

            const userObject = user.toObject();
            
            delete userObject.password;
            delete userObject.tokens;
            delete userObject.avatar;
            return userObject;
        }
    }
);


// Register a method to usewr schema
// Below is the static method will be called by collection or schema
userSchema.statics.findByCredentials = async (email, p) => {

    const user = await User.findOne({email});
    
    if(!user) throw new Error('Wrong credentials');

    const isMatch = await userFomatter.comparePassword(p, user.password);

    if(!isMatch) throw new Error('Unable to login');

    return user;
};

// use middleware to run before and after save, validate
// middle ware provides hook/listener for certain operations on model
// arrow function does not bind to this
// Here hash the password
// Following even is triggered when isnatnce is saved
userSchema.pre('save', async function (next) {

    const user = this;

    //console.log(userFomatter.formatPassword(user.password));
    if(user.isModified('password')){
        user.password = await userFomatter.formatPassword(user.password);
    }

    // finish presave work, has to call next
    next();

});


// use middleware
// whenever a user is deleted all tasks must be deleted.
// Let's add this to pre delete action

userSchema.pre('delete', async function (next) {
    const user = this;

    taskModel.deleteMany({ author : user._id});
});

const User = mongoose.model('User',userSchema);

module.exports = User;