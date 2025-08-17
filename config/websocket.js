import { WebSocketServer } from 'ws';
import player from '../app/player.js';

export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');

        // Send hello world message when client connects
        ws.send(JSON.stringify({
            type: 'welcome',
            message: 'Hello World! Welcome to PiSignage WebSocket Server'
        }));

        // Handle incoming messages
        ws.on('message', function message(msg) {
            var messageArguments = ["none"];
            try {
                messageArguments = JSON.parse(msg);
            } catch (e) {
                console.error('Unable to parse message from client ws, ' + msg);
                return;
            }
            
            switch (messageArguments[0]) {
                case "status":
                    var settings = messageArguments[1],
                        status = messageArguments[2],
                        priority = messageArguments[3];

                    var statusObject = {
                        lastReported: Date.now(),
                        ip: ws._socket.remoteAddress,
                        socket: ws.id || 'ws_' + Date.now(),
                        priority: priority,
                        serverName: ws._socket.server.address().address,
                        newSocketIo: true,
                        webSocket: true,
                        ...settings,
                        ...status
                    };
                    
                    console.log('Player status update:', statusObject);
                    player.updatePlayerStatus(statusObject);
                    break;
                    
                case 'secret_ack':
                    console.log('Secret acknowledgment:', messageArguments[1]);
                    player.secretAck(ws.id || 'ws_' + Date.now(), !messageArguments[1]);
                    break;

                case 'shell_ack':
                    console.log('Shell acknowledgment:', messageArguments[1]);
                    player.shellAck(ws.id || 'ws_' + Date.now(), messageArguments[1]);
                    break;

                case 'snapshot':
                    console.log('Screenshot request:', messageArguments[1]);
                    player.piScreenShot(ws.id || 'ws_' + Date.now(), messageArguments[1]);
                    break;

                case 'upload':
                    var playerId = messageArguments[1],
                        filename = messageArguments[2],
                        data = messageArguments[3];
                    console.log('Upload request:', { playerId, filename, dataSize: data ? data.length : 0 });
                    player.upload(playerId, filename, data);
                    break;
                    
                default:
                    console.log('Unknown message type:', messageArguments[0]);
                    break;
            }
        });

        // Handle client disconnect
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });

        // Handle errors
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log('WebSocket server initialized');
    return wss;
};
