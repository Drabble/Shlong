const WebSocket = require("ws");

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_5m");

ws.on("open", function open() {
  //ws.send("something");
});

ws.on("message", function incoming(data) {
  console.log(JSON.parse(data).k.c);
});
