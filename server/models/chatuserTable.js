'use strict';

module.exports = (sequelize, DataTypes) => {
  var ChatUser = sequelize.define("ChatUser", {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });
  ChatUser.associate = function (models) {
    // define association here
    ChatUser.belongsTo(models.Chat, { foreignKey: 'chatId' })
    ChatUser.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return ChatUser;
}

