exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {//로그인 여부 알려줌
        next();
    } else {
        res.status(403).send('need to login');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

