const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id)

    if (!readingListEntry) {
      return res.status(404).json({
        error: 'reading list entry not found'
      })
    }

    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: 'operation not allowed'
      })
    }

    if (typeof req.body.read !== 'boolean') {
      return res.status(400).json({
        error: 'read must be a boolean'
      })
    }

    readingListEntry.read = req.body.read
    await readingListEntry.save()

    res.json(formatReadingList(readingListEntry))
  } catch (error) {
    next(error)
  }
})
/*
for example in power shell:

$loginResponse = Invoke-RestMethod `
  -Uri http://localhost:3001/api/login `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"sample.admin@example.com","password":"password123"}'

$token = $loginResponse.token
$token


$user = Invoke-RestMethod `
  -Uri http://localhost:3001/api/users/4 `
  -Method Get

$user | ConvertTo-Json -Depth 10


$readingListId = $user.readings[0].reading_list.id

Invoke-RestMethod `
  -Uri "http://localhost:3001/api/readinglists/$readingListId" `
  -Method Put `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"read":true}'
*/

module.exports = router