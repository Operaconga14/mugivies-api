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
        type: DataTypes.STRING,
        references: {
            model: 'Users',  // References the Users table
            key: 'username'  // Links to the username field in User
        }
    }
}, {
    timestamps: false,
    tableName: 'Gigs',
    paranoid: false
});


Gig.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Gig, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

module.exports = Gig;
