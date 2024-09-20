const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Post = sequelize.define('Post', {
    id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    facebook: {
        type: DataTypes.STRING,

    },
    instagram: {
        type: DataTypes.STRING,
    },
    boomplay: {
        type: DataTypes.STRING,
    },
    applemusic: {
        type: DataTypes.STRING,
    },
    spotify: {
        type: DataTypes.STRING,
    },
    tiktok: {
        type: DataTypes.STRING,
    },
    audiomack: {
        type: DataTypes.STRING,
    },
    youtube: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    postedBy: {
        type: DataTypes.STRING,
        references: {
            model: 'Users',  // References the Users table
            key: 'username'  // Links to the username field in User
        }
    }
},
    {
        timestamps: false,
        tableName: 'Posts',
        paranoid: false
    });

Post.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Post, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

module.exports = Post;
