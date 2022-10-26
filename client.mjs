#!/opt/bin/node
import {WebSocket} from 'ws';
import readline from 'readline';

const input=process.stdin;
const output=process.stdout;

const rl=readline.createInterface({input,output,historyfile: "history"});


let socket = new WebSocket("ws://127.0.0.1:8080/");
   
socket.onopen = function(e) {
  console.log("[open] Connection established");
};
   
socket.onmessage = function(event) {
  if(event.data.length!=0) {
    console.log(`[message] Data received from server: ${JSON.stringify(JSON.parse(event.data))}`);
    if(event.data[0]=='{'){
      const rows = JSON.parse(event.data)
      if(rows.rows){
        console.table(rows.rows);
      }
    }
  };
  rl.on('close', ()=>{
    rl.close();
  });
  rl.question("sql> ",(sql)=>{
    socket.send(JSON.stringify({sql}));
  });
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

