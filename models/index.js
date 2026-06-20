const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

Note.belongsTo(User)
User.hasMany(Note)

Blog.belongsTo(User)
User.hasMany(Blog)

//const syncModels = async () => {
//  User.sync({ alter: true })
//  Note.sync({ alter: true })
//  Blog.sync({ alter: true })
//}
//syncModels()

module.exports = {
  Note,
  Blog,
  User,
}