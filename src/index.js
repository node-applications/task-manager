const express = require('express');
const userRouter = require('./routers/Users');
const taskRouter = require('./routers/Tasks');

require('./db/mongoose');


const app = express();
const port  = process.env.PORT;

/*
    Express middleware
    request -> route handler
    request -> do something -> route handler
*/

// app.use(( req, res, next ) => {
//     console.log(req.method, req.path);
//     res.status(503).send('Under maintenance');
//     // call next when no respose is required to be sent
//     //next();
// });

// const multer = require('multer');
// const upload = multer({
//     dest : 'images'
// });


// if one uses async operation, response will be sent before task completion
// remove async to make file upload syncronous
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// })


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up at port ',port);
});

