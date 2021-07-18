const WebSocket = require("ws");

const binance = (app) => {
  function startWebsocket() {
    const binanceWs = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_5m");
    const wss = new WebSocket.Server({
      port: 6000,
      /*perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024,
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024, // Size (in bytes) below which messages
      // should not be compressed.
    },*/
    });

    wss.on("connection", function connection(ws, request, client) {
      console.log(`New user ${client}`);
    });

    binanceWs.on("open", function open() {
      //binanceWs.send("something");
    });

    binanceWs.on("message", function incoming(data) {
      console.log(JSON.parse(data).k.c);
      app.btc_price = JSON.parse(data).k.c;
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ btc_usd: JSON.parse(data).k.c }));
        }
      });
    });

    wss.onclose = function () {
      // connection closed, discard old websocket and create a new one in 5s
      wss = null;
      setTimeout(startWebsocket, 5000);
    };
  }

  startWebsocket();
};

module.exports = binance;
