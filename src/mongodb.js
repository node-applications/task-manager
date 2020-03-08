/*
  MongoDB a good document db

  Mongoose maintains and bridge the gap between JavaScript Object
  to MongoDB doc
*/


// CRUD operation in mongodb

// const mongodb = require('mongodb');

// const MongoClient = mongodb.MongoClient;

const {MongoClient , ObjectID} = require('mongodb');

// const id = new ObjectID();

// console.log(id.getTimestamp());

const connectionUrl = 'mongodb://127.0.0.1:27017';

const dbname = 'task-manager';

MongoClient.connect(
    connectionUrl,
    {useNewUrlParser : true, useUnifiedTopology : true},
    (error, client) => {
        if(error){
            console.log('Error occured !!', error);
            return;
        }

        console.log('Connected to server !! ');

        const db = client.db(dbname);

        //insert many
        // db.collection('users').insertMany([
        //     {
        //         user : 'Varun',
        //         age : 29
        //     },
        //     {
        //         user : 'Pitaji',
        //         age : 61
        //     }
        // ],(error, result) => {
        //     if(error){
        //         return console.log('Items not inserted !!');
        //     }

        //     console.log('Items inserted are : ',result.insertedCount);
        // });

        //Insert one
        // db.collection('users').insertOne({
        //     _id : id,
        //     user : 'Mummy',
        //     age : 59
        // },
        // (error, result) => {
        //     if(error){
        //         return console.log('Data insert got failed !!');
        //     }
        //     console.log(result.ops);
        // });

        // db.collection('tasks').insertMany([
        //     {
        //         description : 'Call milk man',
        //         completed : false 
        //     },
        //     {
        //         description : 'Finish mongodb tutorial',
        //         completed : false
        //     }
        // ],(error, result) => {
        //     if(error){ return console.log(' Cannot be inserted !!');}
        //     console.log('Items are inserted successfully !! ', result.insertedCount);
        // });

        // db.collection('tasks').findOne({_id : ObjectID("5e535cd344aa530948b99e22")}, 
        // (error, result) => {
        //     if(error) return console.log('Unable to fetch.');
        //     console.log(result);
        // });

        db.collection('tasks').find({completed : false}).toArray((error, resArray) => {
            if(error) return console.log('Error in fetching');
            console.log(resArray);
        });

        db.collection('tasks').find({completed : true}).count((error, count) => {
            if(error) return console.log('Error in fetching');
            console.log(count);
        });


        //Update the user name

        // const db_promise = db.collection('users').updateOne(
        //                         {_id:ObjectID('5e52a47648b2e513409f999a')},
        //                         {$set:{user : 'Vaibhav Maurya'}}
        //                         );

        // db_promise.then((result) => {
        //     console.log('Updated document',result.modifiedCount);
        // }).catch((error) => {
        //     console.log('error occured on update');
        // });

        // db.collection('users').updateOne(
        //     {user:'dummy'},
        //     {$inc:{age : 1}}
        // ).then((result) => {
        //     console.log('Updated document',result.modifiedCount);
        //     }).catch((error) => {
        //     console.log('error occured on update');
        // });   
        
        // update many tasks

        // db.collection('tasks').updateMany(
        //     {completed:false},
        //     {$set:{completed:true}})
        //     .then((result) => {
        //         console.log('Updated docs', result.modifiedCount);
        //     })
        //     .catch((error) => {
        //         console.log('ERROR !! ',error);
        //     });

        // delete document

        db.collection('users').deleteMany(
            {age:59})
            .then((result) => {
                console.log('Deleted docs', result.deletedCount);
            })
            .catch((error) => {
                console.log('ERROR !! ',error);
            });

        
        db.collection('tasks').deleteOne({description:'Call milk man'})
            .then((res) => {
                console.log('Deleted ');
            })
            .catch((error) => {
                console.log('Delete Failed ', error);
            })
    }
);

