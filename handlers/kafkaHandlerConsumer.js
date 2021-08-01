const KafkaConsumerClient = require("../services/kafkaConsumeSdk")
const readConfFile = require("../conf/conf");
const redisService = require('../services/redisClientSdk');
const bigMLService = require("../services/bigMLSdk");
const { calcMatrixAcc } = require("./util");
const conf = readConfFile()


module.exports = runKafkaConsumer = (socket) => {


    const onData = async (data) => {
        console.log(`Got new data from kafka! data: ${JSON.stringify(data)}`);
        let matrix;
        try {
            // TODO: save to redis
            if (data.vehicleId) {
                redisService.set(`vehicle-${data.vehicleId}`, JSON.stringify(data));
            }


            //TODO: get big ml prediction
            if (data.type.toLowerCase().indexOf('enter') !== -1) {
                const response = await bigMLService.predict(data);
                if (response?.data?.section)
                    await redisService.set(`predict-exit-${data.vehicleId}`, response.data.section)
            }
            else if (data.type.toLowerCase().indexOf('exit') !== -1) {
                const response = await redisService.get(`predict-exit-${data.vehicleId}`);
                const matrixJSON = await redisService.get('confusion-matrix');
                matrix = [...JSON.parse(matrixJSON)];
                if (response) {
                    matrix[Number(data.section)][Number(response)]++;
                    await redisService.set('confusion-matrix', JSON.stringify(matrix));
                }
            }

        }
        catch (e) {
            console.log(e);
        }
        finally {
            // TODO: send to connected socket
            socket.io.emit('vehicle_update', { vehicle: data, matrix, matrixAccuracy: calcMatrixAcc(matrix) });
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


