/**
 * mongoose : redis cache
 * before running query = <model>.select()
 * query.exec(callback) executes the query. Another way is query.then(callback) also
 * executes the query.
 * query.getOptions() returns the query plan in JS object form
 * 
 * patch mongoose exec to include Redis cache
 * 
 * Add collection and query option both to redis
 * 
 * TODO : 
 * 1. provide option to swirch off cache
 * 2. Use hash key instead single key : hset and hget
 * 3. Clear redis based on top level hash key.
 * 4. Use middleware to expire data in cache
 * 5. Use hash for user's tasks.
 * 6. Add a method to prototype of mongoose Query
 * 
 */

const mongoose = require('mongoose');
const { redisSet, redisGet } = require('./rediscache');

const connectionUrl = process.env.DBCONNECTIONURL;
const dbname = process.env.DBNAME;


/**
 * 
 * @param {*} connectionUrl 
 * @param {*} dbname 
 */

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


const exec = mongoose.Query.prototype.exec;

// Remind u this function return promise
mongoose.Query.prototype.exec = async function(){
    console.log(" I am going to change it !!!");

    
    try {
        const queryKeyObject = Object.assign({}, this.getQuery(), {
            collection : this.mongooseCollection.collectionName
        });
        const queryKey = JSON.stringify(queryKeyObject);
        // check inside redis
        let result = await redisGet(queryKey);

        if(result){
            console.log(`FROM CACHE ${result}`);

            // result is not mongoose document though
            // Change it to model doc
            // in case of collections like array, each item must be a model

            const resultObject = JSON.parse(result);

            return Array.isArray(resultObject) ?
                        resultObject.map(d => new this.model(d)) : 
                                    new this.model(resultObject);

        }else{
            console.log('NOT IN CACHE');
            // exec function returns promise
            result = await exec.apply(this, arguments);
            // set redis cache
            // Automatic cache expiration : set expiry time also
            redisSet(queryKey, JSON.stringify(result), 'EX', 120);

            

            return result;
        }
        
    }catch(e){
        console.log(`Cache not working ${e}`);
        return exec.apply(this, arguments);
    }
};


connectDb(connectionUrl, dbname);