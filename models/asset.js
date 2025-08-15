import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: { type: String, index: true },
    type: String,
    resolution: { width: String, height: String },
    duration: String,
    size: String,
    thumbnail: String,
    labels: [],
    playlists: [],
    validity: {
        enable: Boolean,
        startdate: String,
        enddate: String,
        starthour: Number,
        endhour: Number
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String
    }
}, {
    usePushEach: true
});

// Index for installation
assetSchema.index({ installation: 1 });

// Static methods
assetSchema.statics.load = async function(id) {
    try {
        return await this.findOne({ _id: id }).exec();
    } catch (error) {
        console.error('Error loading asset:', error);
        throw error;
    }
};

assetSchema.statics.list = async function(options = {}) {
    try {
        const criteria = options.criteria || {};
        const perPage = options.perPage || 10;
        const page = options.page || 0;

        return await this.find(criteria)
            .sort({ name: 1 })
            .limit(perPage)
            .skip(perPage * page)
            .exec();
    } catch (error) {
        console.error('Error listing assets:', error);
        throw error;
    }
};

// Method to get safe asset data (without sensitive fields)
assetSchema.methods.toSafeObject = function() {
    const assetObject = this.toObject();
    return assetObject;
};

// Override toJSON to use safe object by default
assetSchema.methods.toJSON = function() {
    return this.toSafeObject();
};

const Asset = mongoose.model('Asset', assetSchema);

export { Asset };
