const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const bcrypt = require('bcrypt')


const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    picture: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING
    },
    facebook: {
        type: DataTypes.STRING
    },
    instagram: {
        type: DataTypes.STRING
    },
    youtube: {
        type: DataTypes.STRING
    },
    audiomack: {
        type: DataTypes.STRING
    },
    tiktok: {
        type: DataTypes.STRING
    },
    boomplay: {
        type: DataTypes.STRING
    },
    applemusic: {
        type: DataTypes.STRING
    },
    spotify: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    collaborations: {
        type: DataTypes.JSON, // or JSON for other databases
        allowNull: true
    },
    awards: {
        type: DataTypes.JSON, // or JSON for other databases
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false,
    tableName: 'Users',
    paranoid: true
});

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10)
})

// Instance method to validate password
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



User.prototype.getFullname = function () {
    return `${this.firstname} ${this.lastname}`
}

User.getUserByEmail = async function (email) {
    return await this.findOne({ where: { email } })
}

// Static method to get user by username
User.getUserByUsername = async function (username) {
    return await this.findOne({ where: { username } });
};

module.exports = User
