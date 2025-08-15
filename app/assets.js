import { Asset } from '../models/asset.js';
import { User } from '../models/user.js';
import { CONFIG } from '../config/config.js';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Get all assets with pagination and file system integration
export const getAssets = async (req, res) => {
    try {
        const { page = 0, perPage = 10, filter = '' } = req.query;
        
        // Read files from media directory (user-specific if authenticated)
        let files = [];
        try {
            let searchDir = CONFIG.mediaDir;
            
            // If user is authenticated, look in their installation directory
            if (req.user && req.user.email) {
                const installationName = req.user.email.split('@')[0];
                const userMediaDir = path.join(CONFIG.mediaDir, installationName);
                
                // Check if user directory exists
                if (fs.existsSync(userMediaDir)) {
                    searchDir = userMediaDir;
                }
            }
            
            const mediaFiles = await fs.promises.readdir(searchDir);
            files = mediaFiles.filter(file => 
                file.charAt(0) !== '_' && file.charAt(0) !== '.'
            );
            
            // If using user directory, prepend installation name to file paths
            if (searchDir !== CONFIG.mediaDir) {
                const installationName = req.user.email.split('@')[0];
                files = files.map(file => `${installationName}/${file}`);
            }
            
            if (files.length) {
                files.sort((str1, str2) => str1.localeCompare(str2, undefined, { numeric: true }));
            }
        } catch (err) {
            console.error('Error reading media directory:', err);
        }

        // Get database assets
        const criteria = {};
        if (filter) {
            criteria.name = { $regex: filter, $options: 'i' };
        }

        const options = {
            criteria,
            perPage: parseInt(perPage),
            page: parseInt(page)
        };

        const dbAssets = await Asset.list(options);
        const total = await Asset.countDocuments(criteria);

        res.json({
            files,
            assets: dbAssets,
            systemAssets: CONFIG.systemAssets,
            pagination: {
                page: parseInt(page),
                perPage: parseInt(perPage),
                total,
                pages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        console.error('Error getting assets:', error);
        res.status(500).json({ message: 'Error retrieving assets' });
    }
};

// Get file details
export const getAsset = async (req, res) => {
    try {
        const { filename } = req.params;
        
        // Determine file path based on user authentication
        let filePath = path.join(CONFIG.mediaDir, filename);
        
        // If user is authenticated and filename doesn't contain installation name, check user directory
        if (req.user && req.user.email && !filename.includes('/')) {
            const installationName = req.user.email.split('@')[0];
            const userFilePath = path.join(CONFIG.mediaDir, installationName, filename);
            
            // Check if file exists in user directory
            try {
                await fs.promises.access(userFilePath);
                filePath = userFilePath;
            } catch (err) {
                // File not found in user directory, use default path
            }
        }
        
        // Get file stats
        let fileData;
        try {
            fileData = await fs.promises.stat(filePath);
        } catch (err) {
            return res.status(404).json({ message: `Unable to read file details: ${err.message}` });
        }

        // Determine file type
        let type = 'other';
        if (filename.match(CONFIG.imageRegex)) type = 'image';
        else if (filename.match(CONFIG.videoRegex)) type = 'video';
        else if (filename.match(CONFIG.audioRegex)) type = 'audio';
        else if (filename.match(CONFIG.htmlRegex)) type = 'html';
        else if (filename.match(CONFIG.liveStreamRegex) || 
                 filename.match(CONFIG.omxStreamRegex) || 
                 filename.match(CONFIG.mediaRss) || 
                 filename.match(CONFIG.CORSLink) || 
                 filename.match(CONFIG.linkUrlRegex)) type = 'link';
        else if (filename.match(CONFIG.gcalRegex)) type = 'gcal';
        else if (filename.match(CONFIG.pdffileRegex)) type = 'pdf';
        else if (filename.match(CONFIG.txtFileRegex)) type = 'text';
        else if (filename.match(CONFIG.radioFileRegex)) type = 'radio';
        else if (filename.match(CONFIG.noticeRegex)) type = 'notice';

        // Get database data
        const dbData = await Asset.findOne({ name: filename });

        res.json({
            name: filename,
            size: Math.floor(fileData.size / 1000) + ' KB',
            ctime: fileData.ctime,
            path: '/media/' + filename,
            type: type,
            dbdata: dbData
        });
    } catch (error) {
        console.error('Error getting asset:', error);
        res.status(500).json({ message: 'Error retrieving asset' });
    }
};

// Create new asset
export const createAsset = async (req, res) => {
    try {
        const {
            name,
            type,
            resolution,
            duration,
            size,
            thumbnail,
            labels = [],
            playlists = [],
            validity = { enable: false }
        } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' });
        }

        const asset = new Asset({
            name,
            type,
            resolution,
            duration,
            size,
            thumbnail,
            labels,
            playlists,
            validity,
            createdBy: {
                _id: req.user._id,
                name: req.user.email
            }
        });

        await asset.save();
        res.status(201).json(asset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ message: 'Error creating asset' });
    }
};

// Update asset
export const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const asset = await Asset.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.json(asset);
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ message: 'Error updating asset' });
    }
};

// Delete asset file
export const deleteAsset = async (req, res) => {
    try {
        const { filename } = req.params;
        
        // Determine file path based on user authentication
        let filePath = path.join(CONFIG.mediaDir, filename);
        
        // If user is authenticated and filename doesn't contain installation name, check user directory
        if (req.user && req.user.email && !filename.includes('/')) {
            const installationName = req.user.email.split('@')[0];
            const userFilePath = path.join(CONFIG.mediaDir, installationName, filename);
            
            // Check if file exists in user directory
            try {
                await fs.promises.access(userFilePath);
                filePath = userFilePath;
            } catch (err) {
                // File not found in user directory, use default path
            }
        }
        
        // Delete the file
        try {
            await fs.promises.unlink(filePath);
        } catch (err) {
            return res.status(404).json({ message: `Unable to delete file ${filename}: ${err.message}` });
        }

        // Delete thumbnail if it exists
        const asset = await Asset.findOne({ name: filename });
        if (asset && asset.thumbnail) {
            const thumbnailName = asset.thumbnail.replace("/media/_thumbnails/", "");
            const thumbnailPath = path.join(CONFIG.thumbnailDir, thumbnailName);
            try {
                await fs.promises.unlink(thumbnailPath);
            } catch (err) {
                console.log('Unable to find/delete thumbnail:', err.message);
            }
        }

        // Delete from database
        await Asset.deleteOne({ name: filename });

        res.json({ message: 'File deleted successfully', filename });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ message: 'Error deleting asset' });
    }
};

// Upload asset files
export const uploadAsset = async (req, res) => {
    try {
        // Handle multer errors
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            try {
                const filename = await renameFile(file, req);
                uploadedFiles.push({
                    name: filename,
                    size: file.size,
                    type: file.mimetype,
                    originalName: file.originalname
                });
            } catch (error) {
                console.error('Error processing file:', error);
                return res.status(500).json({ message: `Error processing file: ${error.message}` });
            }
        }

        res.json({ 
            message: 'Files uploaded successfully', 
            files: uploadedFiles,
            count: uploadedFiles.length
        });
    } catch (error) {
        console.error('Error uploading assets:', error);
        res.status(500).json({ message: 'Error uploading assets' });
    }
};

// Helper function to rename uploaded files
async function renameFile(fileObj, req) {
    console.log("Uploaded file: " + fileObj.path);
    
    let filename = fileObj.originalname.replace(CONFIG.filenameRegex, '').normalize("NFC");
    
    // Replace special characters
    const tr = {
        "ä": "ae", "ö": "oe", "ß": "ss", "ü": "ue", 
        "æ": "ae", "ø": "oe", "å": "aa", "é": "e", "è": "e"
    };
    filename = filename.replace(/[äößüæøåéè]/gi, matched => tr[matched]);
    
    // Handle zip files
    if (filename.match(CONFIG.zipfileRegex)) {
        filename = filename.replace(/ /g, '');
    }
    
    // Handle brand videos
    if (filename.match(CONFIG.brandRegex)) {
        filename = filename.toLowerCase();
    }

    // Determine the destination directory
    let destinationDir = CONFIG.mediaDir;
    if (req.user && req.user.email) {
        const installationName = req.user.email.split('@')[0];
        destinationDir = path.join(CONFIG.mediaDir, installationName);
        
        // Ensure user directory exists
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }
    }

    const newPath = path.join(destinationDir, filename);
    await fs.promises.rename(fileObj.path, newPath);
    
    // Return relative path for database storage
    const relativePath = path.relative(CONFIG.mediaDir, newPath);
    return relativePath;
}

// Get assets by playlist
export const getAssetsByPlaylist = async (req, res) => {
    try {
        const { playlist } = req.params;
        const assets = await Asset.find({ playlists: playlist }).sort({ name: 1 });
        res.json(assets);
    } catch (error) {
        console.error('Error getting assets by playlist:', error);
        res.status(500).json({ message: 'Error retrieving assets' });
    }
};

// Add asset to playlist
export const addAssetToPlaylist = async (req, res) => {
    try {
        const { assetId, playlist } = req.body;
        
        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        if (!asset.playlists.includes(playlist)) {
            asset.playlists.push(playlist);
            await asset.save();
        }

        res.json(asset);
    } catch (error) {
        console.error('Error adding asset to playlist:', error);
        res.status(500).json({ message: 'Error adding asset to playlist' });
    }
};

// Remove asset from playlist
export const removeAssetFromPlaylist = async (req, res) => {
    try {
        const { assetId, playlist } = req.body;
        
        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        asset.playlists = asset.playlists.filter(p => p !== playlist);
        await asset.save();

        res.json(asset);
    } catch (error) {
        console.error('Error removing asset from playlist:', error);
        res.status(500).json({ message: 'Error removing asset from playlist' });
    }
}; 