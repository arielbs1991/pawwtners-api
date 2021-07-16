const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        //will I need to add an image storage variable?
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        password: {
            type: DataTypes.STRING,
            is: /^[0-9a-f]{64$/i,
            validate: {
                len: [6]
            }
        },
        photo: {
            type: DataTypes.JSON,
            allowNull: true,
            notEmpty: false,
            default: []
        },
        media: {
            type: DataTypes.JSON,
            allowNull: true,
            notEmpty: true,
            default: []
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            isEmail: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false,
            // validate: {
            //     len: [1]
            // }
        },
        isPrivacyPolicyAccepted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            notEmpty: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false
        },
        tagline: {
            type: DataTypes.STRING,
            allowNull: true,
            notEmpty: false
        },
        latitude: {
            type: DataTypes.DOUBLE(),
            allowNull: true,
            notEmpty: false
        },
        longitude: {
            type: DataTypes.DOUBLE(),
            allowNull: true,
            notEmpty: false
        },
        maximumDistance: {
            type: DataTypes.DOUBLE(),
            allowNull: true,
            notEmpty: false,
            defaultValue: 50
        },
        provider: {
            type: DataTypes.TEXT,
            allowNull: true,
            notEmpty: false
        },
        is_manual: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            notEmpty: false
        }
    })

    // TODO: modify associations for this application
    User.associate = function (models) {
        User.hasMany(models.Match, {
            onDelete: 'cascade'
        });
        User.hasMany(models.Pet, {
            onDelete: 'cascade'
        });
        User.belongsToMany(models.Chat, { through: 'ChatUser', foreignKey: 'userId' })
        User.hasMany(models.ChatUser, { foreignKey: 'userId' })
    };

    User.beforeCreate(function (user) {
        user.lastName = bcrypt.hashSync(user.lastName, bcrypt.genSaltSync(10), null)
        user.phoneNumber = bcrypt.hashSync(user.phoneNumber, bcrypt.genSaltSync(10), null)
    })

    return User;
};