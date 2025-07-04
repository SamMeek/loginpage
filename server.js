const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

console.log('WebSocket server running on ws://localhost:3000');

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Clean IPv6-mapped IPv4 address (e.g., ::ffff:192.168.1.5)
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    return ip;
}

wss.on('connection', (ws, req) => {
    const ip = getClientIP(req);
    console.log(`🟢 New WebSocket connection from IP: ${ip}`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'login') {
            const isValid = data.username === 'admin' && data.password === '1234';

            console.log(`🔐 Login attempt from IP ${ip}`);
            console.log(`Username: ${data.username} | Password: ${data.password} | Result: ${isValid ? '✅ SUCCESS' : '❌ FAILURE'}`);

            ws.send(JSON.stringify({
                type: 'loginResult',
                success: isValid
            }));
        }
    });
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('✅ HTTP + WebSocket server listening on port 3000');
});
