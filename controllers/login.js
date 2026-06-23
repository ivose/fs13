const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const user = await User.findOne({
      where: {
        username: body.username
      }
    })

    const passwordCorrect = user && body.password === user.password

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    if (user.disabled) {
      return response.status(401).json({
        error: 'account disabled, please contact admin'
      })
    }

    if (!SECRET) {
      return response.status(500).json({
        error: 'SECRET is missing from environment variables'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
      jti: crypto.randomUUID()
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.create({
      token,
      userId: user.id
    })

    response.status(200).send({
        token,
        username: user.username,
        name: user.name
      })
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    next(error)
  }
})

module.exports = router