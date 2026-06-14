const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['name']
      }
    })
    if (!req.blog) {
      return res.status(404).end()
    }
    next()
  } catch (error) {
    next(error)
  }
}

const tokenExtractor = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search ? req.query.search : '' } },
        { author: { [Op.substring]: req.query.search ? req.query.search : '' } }
      ]
    },
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const token = tokenExtractor(req)
    if (!token) {
      return res.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findByPk(decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})
/*
e.g in PowerShell
Invoke-RestMethod `
  -Uri http://localhost:3001/api/blogs/1 `
  -Method Put `
  -ContentType "application/json" `
  -Body '{"likes":3}' */

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    const token = tokenExtractor(req)
    if (!token) {
      return res.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    if (req.blog.userId !== decodedToken.id) {
      return res.status(403).json({ error: 'unauthorized' })
    }

    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router