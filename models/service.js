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
        type: DataTypes.STRING
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
    }
})

Service.belongsTo(User, { foreignKey: 'postedBy' })
User.hasMany(Service, { foreignKey: 'postedBy' })

module.exports = Service
