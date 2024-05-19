import express from 'express'
import bodyParser from 'body-parser'
import crypto from 'node:crypto'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(bodyParser.json()) 
app.use(cors())

// todo : set up database to handle posts storaging
const posts = {}

app.get('/posts', (req, res)=>{
    res.send(posts)
})

app.post('/posts', async (req, res) => {
    // generate id for post
    const id = crypto.randomBytes(4).toString('hex')

    const {title }  = req.body

    posts[id] = {
        id, title
    }

    await axios.post('http://localhost:4005/events',{
        type: 'PostCreated',
        data:{
            id, title
        }
    }).catch((err) => {
        console.error("Error emitting posts POST event")
    })

    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log("received event: ", req.body.type)

    res.send({})
})

app.listen(4000, () => {
    console.log('listening on port 4000')
})