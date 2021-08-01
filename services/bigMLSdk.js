const { default: axios } = require("axios");

class BigMLSDK {
    constructor() {
        this.API_URL = 'http://localhost:8085';
    }
    async predict(data) {
        const response = await axios.get(`${this.API_URL}/predict`, data);
        return response;
    }

};

const bigMLService = new BigMLSDK();

module.exports = bigMLService;
