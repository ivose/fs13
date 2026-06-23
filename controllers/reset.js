const router = require('express').Router()
const { Blog, Note, User, ReadingList, Session } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    await Session.destroy({ where: {}, truncate: true, cascade: true })
    await ReadingList.destroy({ where: {}, truncate: true, cascade: true })
    await Blog.destroy({ where: {}, truncate: true, cascade: true })
    await Note.destroy({ where: {}, truncate: true, cascade: true })
    await User.destroy({ where: {}, truncate: true, cascade: true })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router