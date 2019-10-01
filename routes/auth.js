const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

//로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();//세션삭제
    res.redirect('/');
});

//페이지 render
router.get('/:type', isNotLoggedIn, (req, res) => {
    const value = req.params.type;
    if (value === 'join') {
        res.render('join');//회원가입 화면
    } else if (value === 'login') {
        res.render('login');//로그인 화면
    }
});

//회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, password, nick } = req.body;
    try {
        const exUser = await User.findOne({ where: { email: email, provider: 'local' } });
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            const msg = { result: false, description: 'duplicate email' };
            return res.send(msg);
        }
        const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);

        await User.create({
            email,
            password: hash,
            nick,
        });//db에 사용자 추가
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

//로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {//req.body.email / req.body.password
    try {
        await passport.authenticate('local', (authError, user, info) => {//에러, 성공, 실패
            if (authError) {
                console.error(authError);
                return next(authError);
            }
            if (!user) {
                //사용자 정보 없으면 실패
                req.flash('loginError', info.message);
                return res.redirect('/auth/login');
            }
            return req.login(user, (loginError) => {//session에 로그인 저장된다. 이때 serializeUser가 실행되며 req.user로 사용자 정보 찾을수 있다.
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                res.redirect('/');
            })
        })(req, res, next);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;