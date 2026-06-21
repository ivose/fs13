const { DataTypes } = require('sequelize')
const { id } = require('../util/migrationHelpers')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('teams', {
      id,
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      }
    })
    
    await queryInterface.createTable('memberships', {
      id,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onDelete: 'CASCADE'
      }
    })

    await queryInterface.addConstraint('memberships', {
      fields: ['user_id', 'team_id'],
      type: 'unique',
      name: 'memberships_user_id_team_id_unique'
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('memberships')
    await queryInterface.dropTable('teams')
  },
}