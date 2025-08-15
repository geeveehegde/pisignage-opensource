import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes.js';
import passport from './passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { CONFIG } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

export const createApp = () => {
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
        secret: 'secret',
        store: MongoStore.create({
            mongoUrl: CONFIG.DB_URL,
            collectionName: 'sessions'
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    }));

                app.use(passport.initialize());
            app.use(passport.session());

            // Serve static media files
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const mediaPath = path.join(__dirname, '..', CONFIG.mediaDir);
            app.use('/media', express.static(mediaPath));

            // Error handling middleware for multer
            app.use((error, req, res, next) => {
                if (error instanceof multer.MulterError) {
                    if (error.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ message: 'File too large. Maximum size is 500MB.' });
                    }
                    if (error.code === 'LIMIT_FILE_COUNT') {
                        return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
                    }
                    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                        return res.status(400).json({ message: 'Unexpected file field.' });
                    }
                    return res.status(400).json({ message: error.message });
                }
                next(error);
            });

            app.use(routes);

    return app;
};