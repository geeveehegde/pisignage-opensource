import mongoose from "mongoose";
import _ from 'lodash';
import Player from '../models/player.js';
import Group from '../models/group.js';

export const playerConfig = {
    updatePlayerCount : {},
    perDayCount : 20 *24,
    activePlayers : {},
    updatePlayerStatus: async function(obj) {
        
        this.updatePlayerCount[obj.cpuSerialNumber] = (this.updatePlayerCount[obj.cpuSerialNumber] || 0) + 1;
        if(this.updatePlayerCount[obj.cpuSerialNumber] > this.perDayCount){
            console.log(`Player ${obj.cpuSerialNumber} has exceeded the daily limit of ${this.perDayCount} updates`);
        }
        
        try {
            let player;
            const data = await Player.findOne({cpuSerialNumber: obj.cpuSerialNumber});
            
            if (data) {
                // Player exists, update with new data
                if (!obj.lastUpload || (obj.lastUpload < data.lastUpload))
                    delete obj.lastUpload;
                if (!obj.name || obj.name.length == 0)
                    delete obj.name;
                    
                player = _.extend(data, obj);
                if (!player.isConnected) {
                    player.isConnected = true;
                }
            } else {
                // Create new player
                player = new Player(obj);
                
                // Get the default group from database
                try {
                    const defaultGroup = await Group.findOne({ name: 'default' });
                    if (defaultGroup) {
                        player.group = {
                            _id: defaultGroup._id,
                            name: defaultGroup.name
                        };
                    } else {
                        // Fallback if default group doesn't exist
                        player.group = { name: 'default' };
                        console.warn('Default group not found, using fallback');
                    }
                } catch (error) {
                    console.error('Error finding default group:', error);
                    player.group = { name: 'default' };
                }
                
                player.installation = 'local'; 
                player.isConnected = true;
            }
            
            // Server license feature, disable communication if server license is not available
            if (player.serverServiceDisabled)
                player.socket = null;

            // Track active players
            this.activePlayers[player._id.toString()] = true;
            
            // Handle group communication and throttling
            if (!player.registered || obj.request) {
                try {
                    const Group = mongoose.model('Group');
                    const group = await Group.findById(player.group._id);
                    
                    if (group) {
                        const now = Date.now();
                        const pid = player._id.toString();
                        
                        // Throttle messages (60 seconds unless priority)
                        this.lastCommunicationFromPlayers = this.lastCommunicationFromPlayers || {};
                        if (!this.lastCommunicationFromPlayers[pid] || 
                            (now - this.lastCommunicationFromPlayers[pid]) > 60000 || 
                            obj.priority) {
                            
                            this.lastCommunicationFromPlayers[pid] = now;
                            // TODO: Implement sendConfig function
                            // sendConfig(player, group, (this.updatePlayerCount[obj.cpuSerialNumber] === 1));
                            console.log(`Sending config to player ${player.name} (first update: ${this.updatePlayerCount[obj.cpuSerialNumber] === 1})`);
                        } else {
                            console.log(`Communication throttled for player ${player.name}`);
                        }
                    } else {
                        console.log("Unable to find group for the player");
                    }
                } catch (groupError) {
                    console.error("Error finding group:", groupError);
                }
            }
            
            // Save player
            await player.save();
            console.log(`Player ${player.cpuSerialNumber} status updated successfully`);
            
        } catch (error) {
            console.error(`Error in updatePlayerStatus for ${obj.cpuSerialNumber}:`, error);
        }
    },
    
    secretAck: function(socketId, hasError) {
        console.log(`Secret acknowledgment for ${socketId}, error: ${hasError}`);
    },
    
    shellAck: function(socketId, response) {
        console.log(`Shell acknowledgment for ${socketId}:`, response);
    },
    
    piScreenShot: function(socketId, response) {
        console.log(`Screenshot for ${socketId}:`, response);
    },
    
    upload: function(playerId, filename, data) {
        console.log(`Upload for ${playerId}: ${filename}, size: ${data ? data.length : 0}`);
    },

};
    // API function to get player by ID
    export const getPlayer = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Player ID is required'
                });
            }

            const player = await Player.findById(id);
            
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }

            res.json({
                success: true,
                data: player
            });

        } catch (error) {
            console.error('Error getting player:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };

    // API function to get all players
    export const getAllPlayers = async (req, res) => {
        try {
            var criteria = {};

            // Filter by group ID
            if (req.query['group']) {
                criteria['group._id'] = req.query['group'];
            }

            // Filter by group name
            if (req.query['groupName']) {
                criteria['group.name'] = req.query['groupName'];
            }

            // Search by string (player name)
            if (req.query['string']) {
                var str = new RegExp(req.query['string'], "i");
                criteria['name'] = str;
            }

            // Filter by location
            if (req.query['location']) {
                criteria['$or'] = [
                    { 'location': req.query['location'] }, 
                    { 'configLocation': req.query['location'] }
                ];
            }

            // Filter by label
            if (req.query['label']) {
                criteria['labels'] = req.query['label'];
            }

            // Filter by current playlist
            if (req.query['currentPlaylist']) {
                criteria['currentPlaylist'] = req.query['currentPlaylist'];
            }

            // Filter by version
            if (req.query['version']) {
                criteria['version'] = req.query['version'];
            }

            // Filter by connection status
            if (req.query['status'] === 'connected') {
                criteria['isConnected'] = true;
            } else if (req.query['status'] === 'disconnected') {
                criteria['isConnected'] = false;
            }

            // Pagination
            var page = req.query['page'] > 0 ? parseInt(req.query['page']) : 0;
            var perPage = req.query['per_page'] || req.query['limit'] || 500;

            var options = {
                perPage: perPage,
                page: page,
                criteria: criteria
            };

            console.log('Player query criteria:', criteria);
            console.log('Player query options:', options);

            // Use the static list method from Player model
            try {
                const players = await Player.list(options);
                
                var data = {
                    objects: players,
                    page: page,
                    pages: Math.ceil(players.length / perPage),
                    count: players.length
                };

                // Add version information if available
                try {
                    const pipkgjson = await import('../../package.json', { assert: { type: 'json' } });
                    data.currentVersion = {
                        version: pipkgjson.default.version || 'unknown',
                        platform_version: pipkgjson.default.platform_version || 'unknown'
                    };
                } catch (versionError) {
                    console.log('Version info not available:', versionError.message);
                    data.currentVersion = {
                        version: 'unknown',
                        platform_version: 'unknown'
                    };
                }

                res.json({
                    success: true,
                    message: 'sending Player list',
                    data: data
                });
            } catch (err) {
                console.error('Error listing players:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Unable to get Player list',
                    error: err.message
                });
            }
        } catch (error) {
            console.error('Error getting all players:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };

    // API function to get player statistics
    export const getPlayerStats = async (req, res) => {
        try {
            const totalPlayers = await Player.countDocuments();
            const connectedPlayers = await Player.countDocuments({ isConnected: true });
            const disconnectedPlayers = totalPlayers - connectedPlayers;
            
            // Get players by group
            const groupStats = await Player.aggregate([
                {
                    $group: {
                        _id: '$group.name',
                        count: { $sum: 1 },
                        connected: { $sum: { $cond: ['$isConnected', 1, 0] } }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            // Get recent activity (last 24 hours)
            const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentActivity = await Player.countDocuments({
                lastReported: { $gte: last24Hours }
            });

            res.json({
                success: true,
                data: {
                    total: totalPlayers,
                    connected: connectedPlayers,
                    disconnected: disconnectedPlayers,
                    recentActivity,
                    groupStats,
                    activePlayers: 0 // TODO: Get from playerConfig if needed
                }
            });

        } catch (error) {
            console.error('Error getting player stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }


