import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    console.log('received event')
    if(type === 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved'
        try{
            axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
                data:{
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content
                }
            })
        }catch(err){
            console.error(err)
        }
    }
    res.send({})
})

app.listen(4003, () => {
    console.log("v2 port 4003")
    console.log("Listening on 4003")

})