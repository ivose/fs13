const router = require('express').Router()

const { User, Note, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name } = req.body
    const user = await User.create({ username, name })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })

    if (!user) {
      return res.status(404).end()
    }

    user.name = req.body.name
    await user.save()

    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router