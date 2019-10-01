module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        provider: {
            //provider가 구글이면 구글로 로그인 했다는 것 // local 이면 개발자가 만든 
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {//구글로 로그인시 구글 id
          type: DataTypes.STRING(30),
          allowNull: true,
        },

    }, {
            timestamps: true, //sequelize 가 저절로 수정일과 로우 생성일 기록
            paranoid: true, //삭제일 기록- 데이터 복구할 수 있다.
        })
);