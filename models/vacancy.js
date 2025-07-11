const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./user");

const Vacancy = sequelize.define('Vacancy', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    deadline: {
        type: DataTypes.DATE
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
    tableName: 'Vacancies',
    paranoid: false
});

// sequelize.sync({ alter: true });


Vacancy.belongsTo(User, {
    foreignKey: 'postedBy',
    onDelete: 'CASCADE',
    targetKey: 'username'
});
User.hasMany(Vacancy, { foreignKey: 'postedBy', onDelete: 'CASCADE', sourceKey: 'username' });

module.exports = Vacancy;
