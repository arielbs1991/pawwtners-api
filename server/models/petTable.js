
//add constraints and validators later
module.exports = function (sequelize, DataTypes) {
    var Pet = sequelize.define("Pet", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        nickName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // location: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        //will likely need to change when users can upload images
        photo: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secondaryBreed: {
            type: DataTypes.STRING,
            allowNull: true
        },
        age: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        personality: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        adoptionStory: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        humanPersonality: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        favoriteFood: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    // TODO: modify associations for this application
    Pet.associate = function (models) {
        Pet.belongsTo(models.User, {
            onDelete: 'cascade'
        });
    };
    return Pet;
};