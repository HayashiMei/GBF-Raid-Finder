const ws = {
    open: function () {
        this.client = new WebSocket("ws://localhost:8181");
    },
    onOpen: function (cb) {
        this.client.onopen = cb;
    },
    onMessage: function (cb) {
        this.client.onmessage = cb;
    },
    send: function (content) {
        this.client.send('Connection to server opened');
    },
}

export default ws;