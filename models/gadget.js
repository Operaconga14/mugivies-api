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
        type: DataTypes.STRING,
        references: {
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
    tableName: 'Gadgets',
    paranoid: false
});

Gadget.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Gadget, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

module.exports = Gadget;
