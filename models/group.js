import mongoose from 'mongoose';

const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: {
        type: String,
        index: true,
        required: true,
        validate: {
            validator: function(name) {
                return name && name.length > 0;
            },
            message: 'Name cannot be blank'
        }
    },
    description: String,

    playlists: [],
    playlistToSchedule: String,
    defaultCustomTemplate: String,
    combineDefaultPlaylist: {
        type: Boolean,
        default: false
    },
    playAllEligiblePlaylists: {
        type: Boolean,
        default: false
    },
    shuffleContent: {
        type: Boolean,
        default: false
    },
    alternateContent: {
        type: Boolean,
        default: false
    },
    timeToStopVideo: {
        type: Number,
        default: 0
    },
    
    assets: [],
    assetsValidity: [],
    ticker: {},

    deployedPlaylists: [],
    deployedAssets: [],
    deployedTicker: {},

    lastDeployed: String,

    enableMpv: {
        type: Boolean,
        default: false
    },
    mpvAudioDelay: {
        type: String,
        default: '0'
    },
    selectedVideoPlayer: {
        type: String,
        default: 'default'
    },
    disableWebUi: {
        type: Boolean,
        default: false
    },
    disableWarnings: {
        type: Boolean,
        default: false
    },
    enablePio: {
        type: Boolean,
        default: false
    },
    disableAp: {
        type: Boolean,
        default: false
    },

    orientation: {
        type: String,
        default: 'landscape'
    },
    animationEnable: {
        type: Boolean,
        default: false
    },
    animationType: {
        type: String,
        default: null
    },
    resizeAssets: {
        type: Boolean,
        default: true
    },
    videoKeepAspect: {
        type: Boolean,
        default: false
    },
    videoShowSubtitles: {
        type: Boolean,
        default: false
    },
    imageLetterboxed: {
        type: Boolean,
        default: false
    },
    signageBackgroundColor: {
        type: String,
        default: "#000"
    },
    urlReloadDisable: {
        type: Boolean,
        default: true
    },
    keepWeblinksInMemory: {
        type: Boolean,
        default: false
    },
    loadPlaylistOnCompletion: {
        type: Boolean,
        default: false
    },
    resolution: {
        type: String,
        default: 'auto'
    },
    sleep: {
        enable: {
            type: Boolean,
            default: false
        },
        ontime: String,
        offtime: String
    },
    reboot: {
        enable: {
            type: Boolean,
            default: false
        },
        time: String,
        absoluteTime: String
    },
    kioskUi: {
        enable: {
            type: Boolean,
            default: false
        },
        url: String,
        timeout: Number
    },
    omxVolume: {
        type: Number,
        default: 100
    },

    logo: {
        type: String,
        default: null
    },
    logox: {
        type: Number,
        default: 10
    },
    logoy: {
        type: Number,
        default: 10
    },
    showClock: {
        enable: {
            type: Boolean,
            default: false
        },
        format: {
            type: String,
            default: "12"
        },
        position: {
            type: String,
            default: "bottom"
        }
    },
    monitorArrangement: {
        mode: {
            type: String,
            default: "mirror"
        },
        reverse: {
            type: Boolean,
            default: false
        }
    },
    emergencyMessage: {
        enable: {
            type: Boolean,
            default: false
        },
        msg: {
            type: String,
            default: ""
        },
        hPos: {
            type: String,
            default: "middle"
        },
        vPos: {
            type: String,
            default: "middle"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        _id: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        name: String
    }
}, {
    usePushEach: true,
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Static methods
GroupSchema.statics = {
    // Load a single group by ID
    load: async function(id) {
        try {
            return await this.findById(id).exec();
        } catch (error) {
            throw error;
        }
    },

    // List groups with pagination and filtering
    list: async function(options = {}) {
        try {
            const criteria = options.criteria || {};
            const perPage = options.perPage || 10;
            const page = options.page || 0;

            // Filter out __player__ groups unless explicitly requested
            if (!(criteria.all || criteria.name)) {
                criteria.name = { "$not": /__player__/ };
            }
            delete criteria.all;

            return await this.find(criteria)
                .sort({ name: 1 }) // sort by name
                .limit(perPage)
                .skip(perPage * page)
                .exec();
        } catch (error) {
            throw error;
        }
    },

    // Find all groups
    findAll: async function() {
        try {
            return await this.find().sort({ name: 1 }).exec();
        } catch (error) {
            throw error;
        }
    },

    // Create a new group
    createGroup: async function(groupData) {
        try {
            const group = new this(groupData);
            return await group.save();
        } catch (error) {
            throw error;
        }
    },

    // Update a group
    updateGroup: async function(id, updateData) {
        try {
            return await this.findByIdAndUpdate(id, updateData, { new: true }).exec();
        } catch (error) {
            throw error;
        }
    },

    // Delete a group
    deleteGroup: async function(id) {
        try {
            return await this.findByIdAndDelete(id).exec();
        } catch (error) {
            throw error;
        }
    }
};

// Instance methods
GroupSchema.methods = {
    // Add playlist to group
    addPlaylist: async function(playlistId) {
        if (!this.playlists.includes(playlistId)) {
            this.playlists.push(playlistId);
            return await this.save();
        }
        return this;
    },

    // Remove playlist from group
    removePlaylist: async function(playlistId) {
        this.playlists = this.playlists.filter(id => id.toString() !== playlistId.toString());
        return await this.save();
    },

    // Add asset to group
    addAsset: async function(assetId) {
        if (!this.assets.includes(assetId)) {
            this.assets.push(assetId);
            return await this.save();
        }
        return this;
    },

    // Remove asset from group
    removeAsset: async function(assetId) {
        this.assets = this.assets.filter(id => id.toString() !== assetId.toString());
        return await this.save();
    },

    // Deploy group configuration
    deploy: async function() {
        this.deployedPlaylists = [...this.playlists];
        this.deployedAssets = [...this.assets];
        this.deployedTicker = { ...this.ticker };
        this.lastDeployed = new Date().toISOString();
        return await this.save();
    },

    // Get deployment status
    getDeploymentStatus: function() {
        return {
            isDeployed: this.lastDeployed !== undefined,
            lastDeployed: this.lastDeployed,
            playlistsCount: this.deployedPlaylists.length,
            assetsCount: this.deployedAssets.length,
            hasTicker: Object.keys(this.deployedTicker).length > 0
        };
    }
};

// Pre-save middleware
GroupSchema.pre('save', function(next) {
    // Ensure name is trimmed
    if (this.name) {
        this.name = this.name.trim();
    }
    next();
});

// Indexes for better query performance
GroupSchema.index({ name: 1 });
GroupSchema.index({ createdAt: -1 });
GroupSchema.index({ 'createdBy._id': 1 });

const Group = mongoose.model('Group', GroupSchema);

export default Group;
