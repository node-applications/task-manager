<<<<<<< HEAD
/**
 *  /Users/i074765/mongodb/bin/mongod --dbpath /Users/i074765/mongodb-data
 * 
 * brew install redis
 * brew services start redis
 * redis-cli ping
 */

=======
>>>>>>> ab7cbd03e46d6ed8ad4b29f620137852cf9f98d7
const app = require('./app');
const port  = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up at port ',port);
});

