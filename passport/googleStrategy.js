const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'google' } });//기존에 등록된 사용자가 있을 경우
            if (exUser) {
                done(null, exUser);
            } else {//이전에 등록한적이 없는 경우
                const newUser = await User.create({
                    email: profile.emails[0].value,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'google',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};