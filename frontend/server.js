// Simple HTTP server for Bitcoin Script Learning Lab
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 404 Not Found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 Not Found</title></head>
                        <body>
                            <h1>404 Not Found</h1>
                            <p>The file you requested was not found.</p>
                            <p><a href="/">Go back to Bitcoin Script Lab</a></p>
                        </body>
                    </html>
                `);
            } else {
                // 500 Internal Server Error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // 200 OK
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Bitcoin Script Learning Lab running at http://localhost:${PORT}`);
    console.log(`📚 Open your browser and start learning Bitcoin Script!`);
    console.log(`🛑 Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Bitcoin Script Learning Lab...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
