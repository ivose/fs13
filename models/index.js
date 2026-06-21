const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes')
const ReadingList = require('./reading_list')

Note.belongsTo(User)
User.hasMany(Note)

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_reading' })

ReadingList.belongsTo(User)
ReadingList.belongsTo(Blog)

User.hasMany(ReadingList)
Blog.hasMany(ReadingList)

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  ReadingList
}