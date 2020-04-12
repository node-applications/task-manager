/**
 * https://www.npmjs.com/package/redis
 * brew install redis
 * brew services start redis
 * redis-cli ping
 * redis 
 * 
 * Redis : expire it and flush it.
 * timeout : client.set(key, val, 'EX', 5) -> 'EX' stands for expire and last argument is retentions
 * in 5 seconds
 */
const redis = require('redis');
// Promisify the client.get since it accepts only callbacks
const { promisify } = require('util');
const client = redis.createClient(process.env.REDISURL);


module.exports = {
    redisSet : client.set.bind(client),
    redisGet : promisify(client.get).bind(client)
};