const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

const formatReadingList = (entry) => ({
  id: entry.id,
  user_id: entry.userId,
  blog_id: entry.blogId,
  read: entry.read
})

router.post('/', async (req, res, next) => {
  try {
    const blogId = Number(req.body.blogId)
    const userId = Number(req.body.userId)

    if (!Number.isInteger(blogId)) {
      return res.status(400).json({
        error: 'blogId is required and must be an integer'
      })
    }

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: 'userId is required and must be an integer'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: 'blog not found'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'user not found'
      })
    }

    const existingEntry = await ReadingList.findOne({
      where: {
        blogId,
        userId
      }
    })

    if (existingEntry) {
      return res.status(400).json({
        error: 'blog is already in the reading list of this user'
      })
    }

    const readingListEntry = await ReadingList.create({
      blogId,
      userId,
      read: false
    })

    res.status(201).json(formatReadingList(readingListEntry))
  } catch (error) {
    next(error)
  }
})

module.exports = router