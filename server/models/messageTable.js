
module.exports = function (sequelize, DataTypes) {
  var Message = sequelize.define("Message", {
    from: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    to: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    unread: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  Message.associate = function (models) {
    Message.belongsTo(models.User, {
      onDelete: 'cascade',
      as: "toUser",
      foreignKey: 'to'
    });
    Message.belongsTo(models.User, {
      onDelete: 'cascade',
      as: 'fromUser',
      foreignKey: 'from'
    });
    models.User.hasMany(Message, {
      onDelete: 'cascade',
      as: "toUser",
      foreignKey: 'to'
    });
    models.User.hasMany(Message, {
      onDelete: 'cascade',
      as: 'fromUser',
      foreignKey: 'from'
    });
  };
  return Message;
};