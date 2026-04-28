import ssh2 from "ssh2";
import * as fs from "fs";
import path from "path";
const { Server } = ssh2;
import styles from 'ansi-styles';
let myname = `
██████╗░██╗░█████╗░██╗░░██╗██╗████████╗
██╔══██╗██║██╔══██╗██║░░██║██║╚══██╔══╝
██████╔╝██║██║░░╚═╝███████║██║░░░██║░░░
██╔══██╗██║██║░░██╗██╔══██║██║░░░██║░░░
██║░░██║██║╚█████╔╝██║░░██║██║░░░██║░░░
╚═╝░░╚═╝╚═╝░╚════╝░╚═╝░░╚═╝╚═╝░░░╚═╝░░░
`
let lines = myname.trim().split("\n");
const server = new Server(
  {
    hostKeys: [fs.readFileSync(path.join("keys", "id_rsa"))],
  },
  (client) => {
    client.on("authentication", (ctx) => {
      if (ctx.method === "password") {
        ctx.accept();
      } else {
        ctx.reject();
      }
    });
    client.on("ready", () => {
      console.log("Auth Success");
      
      client.on("session", (accept, reject) => {

        const session = accept();
        session.on("pty", (accept) => accept());
        session.once("shell", (accept, reject) => {
          const stream = accept();
          stream.write("\x1b[2J\x1b[0f")
          stream.write( styles.green.open + "Welcome to my portfolio!" + styles.green.close  + '\n')
           const banner = lines.join("\r\n")
           stream.write(`${styles.blueBright.open}\rq\n${banner}${styles.blueBright.close}\r\n`);
          
          





          stream.on("data", (data) => {
                const str = data.toString()
                if (str.includes("\x03")) {
                    stream.write("^C\n");
                    stream.end();
                    return;
                }
                });
        });
      });
    });
    client.on("end", () => {
    console.log("Client disconnected");
    });
    client.on('error', (err) => {
        console.error((`${styles.red.open}[-] Error Message: ${styles.red.close} ${err.message}`));
        }
        )
})

server.listen(2222, "0.0.0.0", () => {
  console.log("Listening on port 2222") 
})
