'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change column attributes for 'image', 'genre', and 'location'
    await queryInterface.changeColumn('Events', 'image', {
      type: Sequelize.STRING,
      allowNull: true // Adjust based on your needs
    });

    await queryInterface.changeColumn('Events', 'genre', {
      type: Sequelize.STRING,
      allowNull: true // Adjust based on your needs
    });

    await queryInterface.changeColumn('Events', 'location', {
      type: Sequelize.STRING,
      allowNull: true // Adjust based on your needs
    });
  },

  async down(queryInterface, Sequelize) {
    console.log('Reverting column image');
    await queryInterface.changeColumn('Events', 'image', {
      type: Sequelize.STRING,
      allowNull: false, // Revert to previous state if necessary
    });

    console.log('Reverting column genre');
    await queryInterface.changeColumn('Events', 'genre', {
      type: Sequelize.STRING,
      allowNull: false, // Revert to previous state if necessary
    });

    console.log('Reverting column location');
    await queryInterface.changeColumn('Events', 'location', {
      type: Sequelize.STRING,
      allowNull: false, // Revert to previous state if necessary
    });
  }
};
