const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: {
        msg: 'username must be a valid email address'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  admin: {    
    type: DataTypes.BOOLEAN,    
    defaultValue: false  
  },
  disabled: {    
    type: DataTypes.BOOLEAN,    
    defaultValue: false  
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'secret'
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})

module.exports = User