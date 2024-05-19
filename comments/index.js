import express from 'express'
import {randomBytes} from 'node:crypto'
import bodyParser from 'body-parser'
import { connect } from 'node:http2'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

// key : id
// value : Comment object : {id, string}
const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    const {id} = req.params
    res.send(commentsByPostId[id] || [])
})

app.post('/posts/:id/comments', (req,res) => {
    const commentId = randomBytes(4).toString('hex')
    const {content} = req.body
    const {id} = req.params

    const comments = commentsByPostId[id] || []

    comments.push({id: commentId, content})
    commentsByPostId[id] = comments

    axios.post('http://localhost:4005/events', {
        type: "CommentCreated",
        data:{
            id: commentId,
            content,
            postId: id
        }
    }).catch((err) => {
        console.error(err)
    })

    res.status(201).send(comments)
})

app.post('/events', (req, res) => {
    console.log("received event: ", req.body.type)

    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})