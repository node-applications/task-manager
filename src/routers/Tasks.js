const express = require('express');
const TaskModel = require('../models/taskmodel');

const auth = require('../middleware/auth');
const router = express.Router();

/*
  All Tasks operations
*/
router.post('/Tasks', auth, async (req, res) => {


    const task = new TaskModel({
        ...req.body, // es6 concept
        author : req.user._id
    });

    try{
        await task.save();
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

// get all tasks
/*
    Enable filter options like
    ?completed=true

    pagination: top/limit and skip
    sort : ascending anf descending   <field>:<sort type>
*/
router.get('/Tasks', auth, async (req, res) => {

    const match = {};

    const sort = {};

    const queryFields = Object.keys(req.query);

    queryFields.forEach((item) => {
        if (req.query[item] === 'true' || req.query[item] === 'false') { match[item] = req.query[item] === 'true'; }
        else if (item === 'limit' || item === 'skip' || item === 'sort') { 'pass'; }
        else { match[item] = req.query[item]; }
    });

    if (req.query.sort) {
        let a = req.query.sort.split(':');
        sort[a[0]] = a[1] ? a[1] === 'desc' ? -1 : 1 : 1
    }
    
    try{
        //const tasks = await TaskModel.find({author : req.user._id});

        // it returns the user without tasks
        // execPopulate assigns tasks to req.user.tasks



        console.log(sort);
        const tasks = await req.user.populate(
            {
                path : 'tasks',
                match,
                options:{
                    limit : parseInt(req.query.limit),
                    skip : parseInt(req.query.skip),
                    sort
                }
            }
        ).execPopulate();
        res.status(200).send(req.user.tasks);
    }catch(e){
        res.status(500).send(e);
    }

});


// get one task

router.get('/Tasks/:id', auth, async (req, res) => {

    try{
        const task = await TaskModel.findOne({_id : req.params.id, author : req.user._id});

        if(!task){
            return res.status(404).send();
        }

        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});



router.delete('/Tasks/:id', auth, async (req, res) => {

    try{
        const task = await TaskModel.findOneAndDelete({_id : req.params.id, author : req.user._id});
        

        if(!task){
            return res.status(404).send();
        }

        res.send(task);
        //const count = await TaskModel.countDocuments({completed:false});

        //res.setHeader('docCount',count).sendStatus(200);
    }catch(e){
        res.status(500).send(e);
    }

});


router.patch('/Tasks/:id', auth, async (req, res) => {

    const allowedFields = ['completed', 'description'];
    const updateFields = Object.keys(req.body);

    // every return true if all true else false any one is false
    const isValidFields = updateFields.every((field) => allowedFields.includes(field));

    if(! isValidFields ){
        return res.status(400).send({
            error : 'Invalid Fields'
        });
    }

    try {

        // Remove find and update simultaneously to enable middleware hooks

        // const task = await TaskModel.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     {
        //         new : true,
        //         runValidators : true
        //     }
        // );

        const task = await TaskModel.findOne({_id : req.params.id, author : req.user._id});

        if( !task ){
            return res.status(404).send();
        }

        updateFields.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }

});

module.exports = router;