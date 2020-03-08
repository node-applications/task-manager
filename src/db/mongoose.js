const mongoose = require('mongoose');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbname = 'task-manager-api';



const connectDb = (connectionUrl, dbname) => {

    mongoose.connect(
        connectionUrl+'/'+dbname,
        {
            useCreateIndex : true,
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
    ).then((res) => {
        console.log('Connected !! ');
    }).catch((error) => {
        console.log('Connection failed ', error);
    });

};

connectDb(connectionUrl, dbname);