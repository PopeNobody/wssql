#!/opt/bin/node

const http = require('http');
const ws = require('ws');

const wss = new ws.Server({noServer: true});

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    console.error("No upgrade header or not websocket");
    res.end();
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    console.error("no upgrade match");
    res.end();
    return;
  }

  console.error("doing upgrade");
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

var to;
function onConnect(ws) {
  ws.on('message', function (message) {
    message = message.toString();
    let expr=/([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]+)$/gu;
    let name = message.match(expr) || "Guest";
    ws.send(`Hello from server, ${name}!`);
    if(to) {
      clearTimeout(to);
    };
    to=setTimeout(() => ws.close(1000, "Bye!"), 1500);
  });
}

if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}
