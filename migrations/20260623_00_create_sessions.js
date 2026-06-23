const { DataTypes } = require('sequelize')
const { id, timestamps } = require('../util/migrationHelpers')

const addColumnIfMissing = async (queryInterface, tableName, columnName, definition) => {
  const columns = await queryInterface.describeTable(tableName)

  if (!Object.prototype.hasOwnProperty.call(columns, columnName)) {
    await queryInterface.addColumn(tableName, columnName, definition)
  }
}

module.exports = {
  up: async ({ context: queryInterface }) => {
    await addColumnIfMissing(queryInterface, 'users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })

    await queryInterface.createTable('sessions', {
      id: { ...id },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },

      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },

      ...timestamps
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  }
}