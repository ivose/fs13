const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model { }

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: new Date().getFullYear(),
    validate: {
      isInt: {
        msg: 'year must be an integer'
      },
      min: {
        args: [1991],
        msg: 'year must be at least 1991'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: `year must be at most ${new Date().getFullYear()}`
      }
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog