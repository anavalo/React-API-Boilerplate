require("dotenv").config();
const util = require('util');
const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    password: process.env.REDISPASSWORD
})
client.get = util.promisify(client.get);
client.on("error", function (error) {
    console.error(error);
});

module.exports = client;