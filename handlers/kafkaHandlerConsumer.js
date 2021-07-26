const KafkaConsumerClient = require("../services/kafkaConsumeSdk")
const readConfFile = require("../conf/conf");
const redisService = require('../services/redisClientSdk');
const conf = readConfFile()


module.exports = runKafkaConsumer = (socket) => {


    const onData = async (data) => {
        console.log(`Got new data from kafka! data: ${JSON.stringify(data)}`);
        // TODO: save to redis
        try {
            if (data.vehicleId) {
                redisService.set(`vehicle-${data.vehicleId}`, JSON.stringify(data));
            }

            // TODO: send to connected socket
            socket.io.emit('vehicle_update', data);
        }
        catch (e) {
            console.log(e);
        }
    }


    const kafkaConsumer = new KafkaConsumerClient(
        conf.prefix,
        [conf.dataTopic],
        (topics) => console.log(`Consumer connected to kafka!\nListening to topics: [${topics}]`),
        onData,
        () => console.log("Disconnected from kafka!"),
        (err) => console.log(`Kafka got an error: ${err}`),
        undefined,
        undefined
    )


    kafkaConsumer.connect()

}


