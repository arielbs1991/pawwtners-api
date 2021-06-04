'use strict';

module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    message: {
      type: DataTypes.JSON,
      allowNull: true
    },
    chatId: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      references: {
        model: 'Chats',
        key: 'id'
      }
    },
    fromUserId: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unread: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  });

  Message.associate = function (models) {
    // define association here
    Message.belongsTo(models.Chat, { foreignKey: 'chatId' })
    Message.belongsTo(models.User, { foreignKey: 'fromUserId' })
  }

  return Message;
};