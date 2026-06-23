const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')
const { unknownEndpoint, errorHandler } = require('./util/middleware')

const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')
const readingListsRouter = require('./controllers/readinglists')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorRouter)
app.use('/api/reset', resetRouter)
app.use('/api/readinglists', readingListsRouter)

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  //await sequelize.sync({ alter: true })
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()