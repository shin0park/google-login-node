const express = require('express');
const passport = require('passport');

const {isNotLoggedIn } = require('./middlewares');


const router = express.Router();

router.get('/', isNotLoggedIn,
    passport.authenticate(
        'google',
        {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email'],//사용자에게 요청할 Resource server상의 기능
            prompt: 'select_account'//사용자 계정을 선택하라는 메시지를 표시.여러 계정이 있는 사용자일 경우 여러 계정 중에서 선택할 수 있다.

        }
    )
);

router.get('/callback',isNotLoggedIn,
    passport.authenticate('google', { failureRedirect: '/auth/login' }),//구글로그인 실패시
    function (req, res) {
        res.redirect('/');//구글로그인 성공시
    });

module.exports = router;