const router = require('express').Router()

const { User, Note, Blog, Team } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

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
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    const user = await User.create({ username, name, password })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
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
    user.disabled = req.body.disabled
    await user.save()

    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: ['read', 'id'],
          ...(req.query.read !== undefined && ['true','false'].includes(req.query.read) && {
            where: {
              read: req.query.read === 'true'
            }
          })
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      },
    ]
  })
  if (!user) {
    return res.status(404).end()
  }
  res.json(user)
})

module.exports = router