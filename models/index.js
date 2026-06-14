const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

Note.sync({ alter: true })
Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note,
  Blog,
  User,
}