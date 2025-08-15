import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            // Find user by email
            const user = await User.findOne({ email: email });
            
            // If user doesn't exist
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            
            // Use the user's authenticate method to verify password
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            
            // If authentication succeeds, return the user
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;