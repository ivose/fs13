const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      error: error.message
    })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'token invalid'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)

  try {
    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const session = await Session.findOne({
      where: {
        token
      }
    })

    if (!session) {
      return res.status(401).json({
        error: 'session expired or logged out'
      })
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
      return res.status(401).json({
        error: 'user not found'
      })
    }

    if (user.disabled) {
      return res.status(401).json({
        error: 'account disabled, please contact admin'
      })
  }

    req.token = token
    req.decodedToken = decodedToken
    req.user = user

  next()
  } catch (error) {
    next(error)
  }
}

/*
for trying in PowerShell:


$loginResponse = Invoke-RestMethod `
  -Uri http://localhost:3001/api/login `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"sample.admin@example.com","password":"password123"}'
$token = $loginResponse.token

$loginResponse = Invoke-RestMethod `
  -Uri http://localhost:3001/api/login `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"sample.admin@example.com","password":"password123"}'
$token = $loginResponse.token


Invoke-RestMethod `
  -Uri http://localhost:3001/api/logout `
  -Method Delete `
  -Headers @{ Authorization = "Bearer $token" }


Invoke-RestMethod `
  -Uri http://localhost:3001/api/blogs `
  -Method Post `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"title":"Should fail","author":"Ivo","url":"https://example.com/fail","year":2026}'
..
Invoke-RestMethod : {"error":"session expired or logged out"}
*/


module.exports = {
  unknownEndpoint,
  tokenExtractor,
  errorHandler
}