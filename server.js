import { createServer } from 'http';
import { createApp } from './config/express.js';
import mongoose from 'mongoose';
import { CONFIG } from './config/config.js';
import './models/user.js'; // Import user model to register it
import './models/asset.js'; // Import asset model to register it
import './models/player.js'; // Import player model to register it
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWebSocketServer } from './config/websocket.js';


const main = async () => {
    try {
        // Create media directories if they don't exist
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const mediaDir = path.join(__dirname, CONFIG.mediaDir);
        const thumbnailDir = path.join(__dirname, CONFIG.thumbnailDir);

        // Create media directory
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true });
            console.log(`Created media directory: ${mediaDir}`);
        }

        // Create thumbnail directory
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true });
            console.log(`Created thumbnail directory: ${thumbnailDir}`);
        }

        // Create uploads directory for multer
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`Created uploads directory: ${uploadsDir}`);
        }

        await mongoose.connect(CONFIG.DB_URL);
        const server = createServer(createApp());

        // Initialize WebSocket server
        const wss = createWebSocketServer(server);

        server.listen(CONFIG.PORT, () => {
            console.log(`Server running at http://localhost:${CONFIG.PORT}/`);
            console.log(`WebSocket server running on ws://localhost:${CONFIG.PORT}/`);
            console.log(`Media directory: ${mediaDir}`);
            console.log(`Thumbnail directory: ${thumbnailDir}`);
        });
    } catch(err) {
        console.log(err);
    }
};

(async() => {
    await main();
})();
