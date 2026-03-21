import ssh2 from "ssh2"
import * as fs from "fs"
import path from "path"
const { Server } = ssh2 // use as common js module

const server = new Server({
    hostKeys: [fs.readFileSync(path.join('keys', 'id_rsa'))]}
    , (client) => {
        client.on('authentication', (ctx) => {
            if (ctx.method === 'password') {
                ctx.accept()
            } 
            else {
                ctx.reject()
            }
        })
            client.on('ready', () => {
                console.log('Auth Success')
                client.on('session', (accept, reject) => {
                    const session = accept()
                    session.once('shell', (accept, reject) => {
                        const stream = accept()
                        stream.write('Welcome to my portfolio!\n')
                        stream.write('Type "help" for a list of commands.\n')
                    
            }) 
        }
                )})}

    
)

server.listen(2222, '0.0.0.0', () => {
    console.log('Listening on port 2222')
})