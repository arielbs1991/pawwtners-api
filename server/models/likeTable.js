
module.exports = function (sequelize, DataTypes) {
    var Like = sequelize.define("Like", {
        isLiked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: true
        },
        likedUserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Like.associate = function (models) {
        Like.belongsTo(models.User, {
            onDelete: 'cascade'
        });
        models.User.hasMany(Like, {
            onDelete: 'cascade'
        });
    };
    return Like;
};