
const { Server } = require("socket.io");


module.exports = class SocketIOSDK {
    constructor(server) {
        this.io = new Server(server);
        this.io.on('connection', (socket) => {
            console.log('a user connected');

            // this.io.emit('vehicle_update', { "vehicleId": 11, "type": "enter section", "section": 5, "vehicleType": "van", "dayOfWeek": 7, "hour": 2, "dayType": "special" });
        });
    }
};

