var express = require('express');
const { calcMatrixAcc } = require('../handlers/util');
const redisService = require('../services/redisClientSdk');
var router = express.Router();
/* GET home page. */
router.get('/', async function (req, res, next) {
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
