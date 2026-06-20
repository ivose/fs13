const { DataTypes, Sequelize } = require('sequelize')

const timestamps = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}

const id = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
}

module.exports = {
  timestamps,
  id
}