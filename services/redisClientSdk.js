var redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();

class RedisClientSDK {
    constructor() {
        this.client = redisClient;
        this.get = promisify(this.client.get).bind(this.client);
        this.set = promisify(this.client.set).bind(this.client);
    }

};

const redisService = new RedisClientSDK();

module.exports = redisService;
