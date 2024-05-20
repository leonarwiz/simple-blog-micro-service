import express from 'express'
import {randomBytes} from 'node:crypto'
import bodyParser from 'body-parser'
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

    comments.push({id: commentId, content, status: 'pending'})
    commentsByPostId[id] = comments

    axios.post('http://event-bus-srv:4005/events', {
        type: "CommentCreated",
        data:{
            id: commentId,
            content,
            status : 'pending',
            postId: id
        }
    }).catch((err) => {
        console.error(err)
    })

    res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    console.log("received evnet", type)
    if(type === 'CommentModerated'){
        const {id, postId, status, content} = data
        const comments = commentsByPostId[postId]

        const comment = comments.find(comment => {
            return comment.id === id
        })
        comment.status = status

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, 
                postId, 
                status,
                content
            }
        })
    }

    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})