#!/opt/bin/node
const ws = require('ws');
const WebSocket=ws.WebSocket;

let socket = new WebSocket("wss://dev.copblock.app/ws-test/");

function setItUp(delay) {
  setTimeout(()=>{ socket.send("My name is John"); }, delay+250);
  setTimeout(()=>{ socket.send("My name is Paul"); }, delay+500);
  setTimeout(()=>{ socket.send("My name is George"); }, delay+750);
  setTimeout(()=>{ socket.send("My name is Ringo"); }, delay+1000);
}
socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  setItUp(0);
  setItUp(500);
  setItUp(750);
};

socket.onmessage = function(event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};

