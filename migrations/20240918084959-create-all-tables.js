'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Create user table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      username: {
        type: Sequelize.STRING(255), // Explicit length
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      picture: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instruments: {
        type: Sequelize.JSON
      },
      contact: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      youtube: {
        type: Sequelize.STRING
      },
      audiomack: {
        type: Sequelize.STRING
      },
      tiktok: {
        type: Sequelize.STRING
      },
      boomplay: {
        type: Sequelize.STRING
      },
      applemusic: {
        type: Sequelize.STRING
      },
      spotify: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      collaborations: {
        type: Sequelize.JSON, // or Sequelize.JSONB if your database supports it
        allowNull: true
      },
      awards: {
        type: Sequelize.JSON, // or Sequelize.JSONB if your database supports it
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Add a unique index to the 'username' field
    await queryInterface.addIndex('Users', ['username'], { unique: true });

    // Create Gigs Table
    await queryInterface.createTable('Gigs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instruments: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      }
    });

    // create events table
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create Post tble
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING,

      },
      youtube: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING,
      },
      boomplay: {
        type: Sequelize.STRING,
      },
      applemusic: {
        type: Sequelize.STRING,
      },
      spotify: {
        type: Sequelize.STRING,
      },
      tiktok: {
        type: Sequelize.STRING,
      },
      audiomack: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      }
    });

    // Create Vacancy table
    await queryInterface.createTable('Vacancies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      deadline: {
        type: Sequelize.DATE
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create Service Table
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      type: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create gadget table
    await queryInterface.createTable('Gadgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      image: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      type: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
      },
      postedBy: {
        type: Sequelize.STRING(255), // Explicit length matching 'Users' table
        references: {
          model: 'Users',
          key: 'username'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
