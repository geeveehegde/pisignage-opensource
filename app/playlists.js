import  { CONFIG } from '../config/config.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemPlaylists = [
    {
        name:"TV_OFF" ,
        settings: {},
        assets:[],
        layout:"1",
        schedule:{}
    }
];

const isPlaylist = (file) => {
    return (file.charAt(0) == '_' && file.charAt(1) == '_' && file.slice(-5) == ".json");
};

export const newPlaylist = async (playlist) => {
    const file = path.join(CONFIG.mediaDir, ("__" + playlist + '.json'));
    const data = {
        name: playlist,
        settings: {
            ticker: {enable: false, behavior: 'scroll', textSpeed: 3, rss: { enable: false, link: null, feedDelay: 10}},
            ads: {adPlaylist: false, adCount: 1, adInterval: 60},
            audio: {enable: false, random: false, volume: 50}
        },
        assets: [],
        layout: '1',
        templateName: "custom_layout.html",
        schedule: {}
    };

    try {
        await fs.writeFile(file, JSON.stringify(data, null, 4));
        return data;
    } catch (err) {
        throw err;
    }
};

export const index = async (req, res) => {
    try {
        const assetDir = path.join(CONFIG.mediaDir);
        const files = await fs.readdir(assetDir);
        
        const playlists = files.filter(isPlaylist);
        playlists.sort((str1, str2) => str1.localeCompare(str2, undefined, {numeric: true}));
        
        const list = [];
        
        for (const plfile of playlists) {
            const playlist = {
                settings: {},
                assets: [],
                name: path.basename(plfile, '.json').slice(2)
            };
            
            try {
                const data = await fs.readFile(path.join(assetDir, plfile), 'utf8');
                if (data) {
                    const obj = JSON.parse(data);
                    playlist.settings = obj.settings || {};
                    playlist.assets = obj.assets || [];
                    playlist.layout = obj.layout || '1';
                    playlist.templateName = obj.templateName || "custom_layout.html";
                    playlist.videoWindow = obj.videoWindow || null;
                    playlist.zoneVideoWindow = obj.zoneVideoWindow || {};
                    playlist.schedule = obj.schedule || {};
                }
            } catch (e) {
                console.log("playlist index parsing error for " + req.installation);
            }
            
            list.push(playlist);
        }
        
        res.json({
            success: true,
            message: 'Sending playlist list',
            data: list.concat(systemPlaylists)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'directory read error',
            error: err.message
        });
    }
};

export const getPlaylist = async (req, res) => {
    if (req.query['file'] == "TV_OFF") {
        return res.status(400).json({
            success: false,
            message: 'System Playlist, can not be edited'
        });
    }

    try {
        const file = path.join(CONFIG.mediaDir, ("__" + req.params['file'] + '.json'));
        const data = await fs.readFile(file, 'utf8');
        
        const playlist = {
            settings: {},
            layout: '1',
            assets: [],
            videoWindow: null,
            zoneVideoWindow: {},
            templateName: "custom_layout.html"
        };
        
        if (data) {
            try {
                const obj = JSON.parse(data);
                playlist.settings = obj.settings || {};
                playlist.assets = obj.assets || [];
                playlist.layout = obj.layout || '1';
                playlist.templateName = obj.templateName || "custom_layout.html";
                playlist.videoWindow = obj.videoWindow || null;
                playlist.zoneVideoWindow = obj.zoneVideoWindow ? obj.zoneVideoWindow : {};
                playlist.schedule = obj.schedule || {};
            } catch (e) {
                console.log("getPlaylist parsing error for " + req.installation);
            }
        }

        res.json({
            success: true,
            message: 'Sending playlist content',
            data: playlist
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'playlist file read error',
            error: err.message
        });
    }
};

export const createPlaylist = async (req, res) => {
    try {
        const data = await newPlaylist(req.body['file']);
        res.json({
            success: true,
            message: "Playlist Created: ",
            data: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Playlist write error",
            error: err.message
        });
    }
};

export const savePlaylist = async (req, res) => {
    try {
        const file = path.join(CONFIG.mediaDir, ("__" + req.params['file'] + '.json'));
        let data;
        
        try {
            data = await fs.readFile(file, 'utf8');
        } catch (err) {
            if (err.code == 'ENOENT' && req.params['file'] == "TV_OFF") {
                data = JSON.stringify(systemPlaylists[0]);
            } else {
                throw err;
            }
        }
        
        let fileData = { version: 0, layout: "1" };
        let dirty = false;

        if (data) {
            try {
                fileData = JSON.parse(data);
            } catch (e) {
                console.log("savePlaylist parsing error for ");
            }
            fileData.version = fileData.version || 0;
        }
        
        if (req.body.name) {
            fileData.name = req.body.name;
            dirty = true;
        }
        if (req.body.settings) {
            fileData.settings = req.body.settings;
            dirty = true;
        }
        if (req.body.assets) {
            fileData.assets = req.body.assets;
            dirty = true;
        }
        if (req.body.schedule) {
            fileData.schedule = req.body.schedule;
            dirty = true;
        }
        if (req.body.layout) {
            fileData.layout = req.body.layout;
            fileData.templateName = req.body.templateName;
            fileData.videoWindow = req.body.videoWindow || null;
            fileData.zoneVideoWindow = req.body.zoneVideoWindow || null;
            dirty = true;
        }

        if (dirty) {
            fileData.version += 1;
            await fs.writeFile(file, JSON.stringify(fileData, null, 4));
            res.json({
                success: true,
                message: "Playlist Saved: ",
                data: fileData
            });
        } else {
            res.json({
                success: true,
                message: "Nothing to Update: ",
                data: fileData
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Playlist save error",
            error: err.message
        });
    }
}; 