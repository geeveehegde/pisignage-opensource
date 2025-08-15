import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.authenticate = function(password) {
    return this.hashedPassword === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to get user data without sensitive fields
userSchema.methods.loadUser = function() {
    const userObject = this.toObject();
    delete userObject.hashedPassword;
    delete userObject.salt;
    return userObject;
};

// Override toJSON to exclude sensitive fields by default
userSchema.methods.toJSON = function() {
    return this.loadUser();
};

// Static method to load user by username/email and return safe data
userSchema.statics.loadUserByUsername = async function(username) {
    try {
        const user = await this.findOne({ email: username });
        if (!user) {
            return null;
        }
        return user.loadUser();
    } catch (error) {
        console.error('Error loading user by username:', error);
        throw error;
    }
};

// Static method to load user by ID and return safe data
userSchema.statics.loadUserById = async function(id) {
    try {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }
        return user.loadUser();
    } catch (error) {
        console.error('Error loading user by ID:', error);
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

export { User };