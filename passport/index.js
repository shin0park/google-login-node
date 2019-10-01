const local = require('./localStrategy');
const google = require('./googleStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    //메모리session에 id 만 저장.
    passport.deserializeUser((id, done) => {
        console.log("deserializeUser passport");
        User.findOne({ where: { id } })
        //id를 이용해 완전한 user정보로 복구--> req.user
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local(passport);
    google(passport);
};