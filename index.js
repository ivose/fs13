require('dotenv').config()
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})


class Note extends Model { }
Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    important: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})


class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})




const PORT = process.env.PORT || 3001



app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll()
    //console.log(notes.map(n => n.toJSON()))
    console.log(JSON.stringify(notes, null, 2))
    res.json(notes)
})

app.post('/api/notes', async (req, res) => {
    try {
        const note = await Note.create({ ...req.body, date: new Date() })
        return res.json(note)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

app.get('/api/notes/:id', async (req, res) => {
    const note = await Note.findByPk(req.params.id)
    if (note) {
        //console.log(note)
        console.log(note.toJSON())
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.put('/api/notes/:id', async (req, res) => {
    const note = await Note.findByPk(req.params.id)
    if (note) {
        note.important = req.body.important
        await note.save()
        res.json(note)
    } else {
        res.status(404).end()
    }
})

//--------blogit

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    //console.log(blogs.map(n => n.toJSON()))
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create({ ...req.body, date: new Date() })
        return res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        //console.log(blog)
        console.log(blog.toJSON())
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

app.put('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        blog.important = blog.important + 1
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).end()
    }
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
