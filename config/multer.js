import multer from 'multer';
import path from 'path';
import { CONFIG } from './config.js';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create user-specific directory based on installation name
        if (req.user && req.user.email) {
            const installationName = req.user.email.split('@')[0]; // Use part before @ as installation name
            const userUploadDir = path.join(uploadDir, installationName);
            
            // Ensure user directory exists
            if (!fs.existsSync(userUploadDir)) {
                fs.mkdirSync(userUploadDir, { recursive: true });
            }
            
            cb(null, userUploadDir);
        } else {
            // Fallback to default upload directory if no user
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type based on mimetype and extension
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp',
        // Videos
        'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv', 'video/flv', 'video/webm', 'video/m4v',
        // Audio
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg', 'audio/m4a',
        // Documents
        'text/html', 'text/plain', 'application/pdf',
        // Other
        'application/zip', 'application/x-zip-compressed'
    ];

    const allowedExtensions = [
        // Images
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp',
        // Videos
        '.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v',
        // Audio
        '.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a',
        // Documents
        '.html', '.htm', '.txt', '.pdf',
        // Other
        '.zip', '.gcal', '.radio', '.notice'
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(ext);

    if (isValidMimeType || isValidExtension) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
        files: 10 // Maximum 10 files per upload
    }
});

// Specific upload configurations
export const uploadAssets = upload.array('assets', 10); // 'assets' is the field name, max 10 files
export const uploadSingleAsset = upload.single('asset'); // Single file upload

export default upload; 