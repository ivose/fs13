const router = require('express').Router()
const { Op } = require('sequelize')

const { Note, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let important = { [Op.in]: [true, false] }
  if ( req.query.important ) {
    important = req.query.important === "true"
  }
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important,
      content: {
        [Op.substring]: req.query.search ? req.query.search : ''
      }
    },
    order: [['date', 'DESC']]
  })
  res.json(notes)
})

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