import fs from 'fs';
import { WebSocketServer } from 'ws';
const initOptions = {
}
const pgp = (await import("pg-promise")).default(initOptions);
const cred = JSON.parse(fs.readFileSync("/home/nn/.parse/pg_admin.json").toString('utf8'));
const db = pgp(cred);
console.table(await db.any("select * from log"));
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    try {
      const msg = JSON.parse(data);
      console.log({msg});
      const rows = await db.any(msg.sql);
      ws.send(JSON.stringify({rows},null,2));
    } catch ( err ) {
      console.log(err);
      ws.send("");
    };
  });
  ws.send("");
});

