const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    image: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'Events',
    paranoid: false
});


Event.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Event, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

// sequelize.sync({ alter: true });


module.exports = Event;
