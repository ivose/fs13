require('dotenv').config()

const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT
    })

    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await sequelize.close()
  }
}

main()

/*
 node .\cli.js
◇ injected env (2) from .env // tip: ⌁ auth for agents [www.vestauth.com]
Executing (default): SELECT * FROM blogs
Robert C. Martin: 'Clean Coder Blog', 10 likes
Dan Abramov: 'Overreacted', 5 likes
*/