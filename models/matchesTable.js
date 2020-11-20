const Sequelize = require("sequelize");
const sequelize = require("./index");

module.exports = function (sequelize, DataTypes) {
    var Match = sequelize.define("Match", {
        isLiked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    Match.associate = function (models) {
        Match.belongsTo(models.User, {
            onDelete: 'cascade'
        });
    };
    return Match;
};