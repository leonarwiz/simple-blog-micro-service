import express from 'express'
import bodyParser from 'body-parser'
import crypto from 'node:crypto'

const app = express()
app.use(bodyParser.json())

// todo : set up database to handle posts storaging
const posts = {}

app.get('/posts', (req, res)=>{
    console.log(posts)
    res.send(posts)
})

app.post('/posts', (req, res) => {
    // generate id for post
    const id = crypto.randomBytes(4).toString('hex')

    const {title }  = req.body

    posts[id] = {
        id, title
    }

    res.status(201).send(posts[id])
})

app.listen(4000, () => {
    console.log('listening on port 4000')
})