const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Gig = sequelize.define('Gig', {
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
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instruments: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    postedBy: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'Gigs',
    paranoid: true
})


Gig.belongsTo(User, { foreignKey: 'postedBy' })
User.hasMany(Gig, { foreignKey: 'postedBy' })

module.exports = Gig
