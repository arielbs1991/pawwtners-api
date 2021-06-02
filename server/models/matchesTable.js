
module.exports = function (sequelize, DataTypes) {
    var Match = sequelize.define("Match", {
        isLiked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        },
        matchedUserId: {
            type: DataTypes.INTEGER,
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