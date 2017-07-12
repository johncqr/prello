var instance;

module.exports = {
    getInstance: function () {
        return instance;
    },
    setUp: function(server) {
        instance = require('socket.io')(server);
        instance.on('connect', function (socket) {
            socket.on('join', function (data) {
                socket.join(data.roomid);
                console.log(`User has joined room ${data.roomid}`)
            });
        });
    }
}