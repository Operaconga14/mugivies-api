const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Service = sequelize.define('Service', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    type: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
    },
    postedBy: {
        type: DataTypes.STRING, references: {
            model: 'Users',  // References the Users table
            key: 'username'  // Links to the username field in User
        }
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
    }
}, {
    timestamps: false,
    tableName: 'Services',
    paranoid: false
});

Service.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Service, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

module.exports = Service;
