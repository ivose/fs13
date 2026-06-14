const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Note, User } = require('../models')
const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({ ...req.body, userId: user.id, date: new Date() })
    res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id, {
    include: {
      model: User,
      attributes: ['name']
    }
  })
  if (!req.note) {
    return res.status(404).end()
  }
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  res.json(req.note)
})

router.delete('/:id', noteFinder, async (req, res) => {
  await req.note.destroy()
})

router.put('/:id', noteFinder, async (req, res) => {
  req.note.important = req.body.important
  await req.note.save()
  res.json(req.note)
})

module.exports = router