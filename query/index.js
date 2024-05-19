import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'



const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

app.post('/events', (req, res) => {
    const {type, data} = req.body 
    console.log({type})

    if(type === 'PostCreated'){
        const {id, title} = data
        console.log({id, title})

        posts[id] = {id, title, comments: []}
    }

    if(type === 'CommentCreated'){
        const {id, content, postId} = data
        console.log({id, content, postId})
        posts[postId].comments.push({
            id, content
        })
    }

    res.send({})
})

app.get('/posts', (req, res) => { 
    res.send(posts)
})

app.listen(4002, () => {
    console.log("Listening on 4002")
})