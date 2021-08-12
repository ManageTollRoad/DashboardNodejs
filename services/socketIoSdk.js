
const { Server } = require("socket.io");


module.exports = class SocketIOSDK {
    constructor(server) {
        this.io = new Server(server);
        this.io.on('connection', (socket) => {
            console.log('a user connected');
        });
    }
};

