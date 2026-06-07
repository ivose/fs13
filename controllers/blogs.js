const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).end()
    }
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch(error) {
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
  } catch(error) {
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

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router