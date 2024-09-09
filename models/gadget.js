const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Gadget = sequelize.define('Gadget', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    image: {
        type: DataTypes.JSON,
        defaultValue: []
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
}, {
    timestamps: false,
    tableName: 'Gadgets',
    paranoid: true
})

Gadget.belongsTo(User, { foreignKey: 'postedBy' })
User.hasMany(Gadget, { foreignKey: 'postedBy' })

module.exports = Gadget
