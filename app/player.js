import mongoose from "mongoose";
import _ from 'lodash';
import Player from '../models/player.js';
const defaultGroup = {_id: 0, name: 'default'};

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
                player.group = defaultGroup; 
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
            const { page = 1, limit = 50, status, group, search } = req.query;
            
            const query = {};
            
            // Filter by connection status
            if (status === 'connected') {
                query.isConnected = true;
            } else if (status === 'disconnected') {
                query.isConnected = false;
            }
            
            // Filter by group
            if (group) {
                query['group.name'] = group;
            }
            
            // Search by name or cpuSerialNumber
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { cpuSerialNumber: { $regex: search, $options: 'i' } }
                ];
            }

            const options = {
                page: parseInt(page),
                perPage: parseInt(limit),
                criteria: query
            };

            // Use the static list method from Player model
            try {
                const players = await Player.list(options);
                
                res.json({
                    success: true,
                    data: players,
                    pagination: {
                        page: options.page,
                        limit: options.perPage
                    }
                });
            } catch (err) {
                console.error('Error listing players:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
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
                    activePlayers: Object.keys(this.activePlayers).length
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


