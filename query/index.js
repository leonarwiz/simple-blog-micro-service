import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios'



const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const eventHandler = (type, data) => {
    if(type === 'PostCreated'){
        const {id, title} = data
        console.log({id, title})

        posts[id] = {id, title, comments: []}
    }

    if(type === 'CommentCreated'){
        const {id, content, status, postId} = data
        posts[postId].comments.push({
            id, content, status
        })
    }

    if(type === 'CommentUpdated'){
        const {id, postId, status, content} = data
        const comments = posts[postId].comments
        const comment = comments.find(comment => {
            return comment.id === id
        })
        comment.status = status
        comment.content = content
    }
}

app.post('/events', (req, res) => {
    const {type, data} = req.body 
    eventHandler(type, data)
    console.log(posts)
    res.send({})
})

app.get('/posts', (req, res) => { 
    res.send(posts)
})

app.listen(4002, async () => {
    console.log("Listening on 4002")

    const res = await axios.get('http://event-bus-srv:4005/events')
        .catch((err) => {
            console.error(err)
        })
    for(let event of res.data){
        console.log("Prcosessing event: ", event.type)
        eventHandler(event.type, event.data)
    }
})