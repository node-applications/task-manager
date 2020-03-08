const mongoose = require('mongoose');

const validator = require('validator');


const taskSchema = mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true
    },

    completed : {
        type : Boolean,
        default : false
    },

    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},
{
    timestamps : true
});

const TaskModel = mongoose.model('task',taskSchema);

module.exports = TaskModel;