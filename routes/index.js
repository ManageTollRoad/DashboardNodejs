var express = require('express');
const { calcMatrixAcc } = require('../handlers/util');
const redisService = require('../services/redisClientSdk');
var router = express.Router();
/* GET home page. */
router.get('/', async function (req, res, next) {
  //TODO: get from redis all vehicles'
  /* [
    { "vehicleId": 1, "type": "enter section", "section": 5, "vehicleType": "van", "dayOfWeek": 7, "hour": 2, "dayType": "special" },
    { "vehicleId": 2, "type": "exit section", "section": 3, "vehicleType": "private", "dayOfWeek": 5, "hour": 4, "dayType": "special" },
    { "vehicleId": 3, "type": "exit section", "section": 4, "vehicleType": "van", "dayOfWeek": 5, "hour": 8, "dayType": "special" },
    { "vehicleId": 4, "type": "enter section", "section": 4, "vehicleType": "van", "dayOfWeek": 1, "hour": 2, "dayType": "special" },
    { "vehicleId": 5, "type": "exit road", "section": 5, "vehicleType": "private", "dayOfWeek": 4, "hour": 21, "dayType": "special" },
    { "vehicleId": 6, "type": "exit road", "section": 5, "vehicleType": "private", "dayOfWeek": 2, "hour": 4, "dayType": "normal" },
    { "vehicleId": 7, "type": "enter road", "section": 4, "vehicleType": "truck", "dayOfWeek": 7, "hour": 14, "dayType": "normal" },
    { "vehicleId": 8, "type": "enter section", "section": 1, "vehicleType": "private", "dayOfWeek": 6, "hour": 7, "dayType": "special" },
    { "vehicleId": 9, "type": "exit road", "section": 4, "vehicleType": "van", "dayOfWeek": 6, "hour": 4, "dayType": "special" },
    { "vehicleId": 10, "type": "exit road", "section": 5, "vehicleType": "van", "dayOfWeek": 1, "hour": 2, "dayType": "normal" }]*/
  try {
    redisService.client.keys('vehicle-*', async (err, rows) => {
      const vehicles = await Promise.all(rows.map(async (value) => {
        const key = await redisService.get(value);
        return Promise.resolve(JSON.parse(key));
      }));
      const matrixJSON = await redisService.get('confusion-matrix');
      const matrix = JSON.parse(matrixJSON);
      res.render('pages/dashboard', { vehicles, matrix, matrixAccuracy: calcMatrixAcc(matrix) });
    });

  }
  catch (e) {
    console.log(e);
    res.status(500).send('Error while trying to get data');
  }

});

module.exports = router;
