'use strict';

module.exports = (sequelize, DataTypes) => {
    var Chat = sequelize.define('Chat', {
        type: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    Chat.associate = function (models) {
        // define association here
        Chat.belongsToMany(models.User, { through: 'ChatUser', foreignKey: "chatId" })
        Chat.hasMany(models.ChatUser, { foreignKey: 'chatId' })
        Chat.hasMany(models.Message, { foreignKey: 'chatId' })
    }
    return Chat;
};