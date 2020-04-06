const mongoose = require('mongoose');

const connectionUrl = process.env.DBCONNECTIONURL;
const dbname = process.env.DBNAME;



const connectDb = (connectionUrl, dbname) => {

    mongoose.connect(
        connectionUrl.replace('@DB_NAME',dbname),
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