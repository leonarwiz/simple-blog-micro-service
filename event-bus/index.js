import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const events = []

app.post('/events', async (req, res) => {
    const event = req.body

    events.push(event)

    try {
        await axios.post('http://posts-clusterip-srv:4000/events', event);
    } catch (err) {
        console.error('Error posting to posts-clusterip-srv:', err.message);
    }

    // axios.post('http://posts-clusterip-srv:4000/events', event)
    //     .catch((err) => {
    //         console.error(err)
    //     })
    // axios.post('http://localhost:4001/events', event)
    //     .catch((err) => {
    //         console.error(err)
    //     })
    // axios.post('http://localhost:4002/events', event)
    //     .catch((err) => {
    //         console.error(err)
    //     })
    // axios.post('http://localhost:4003/events', event)
    //     .catch((err) => {
    //         console.error(err)
    //     })

    console.log("Received Event: ", event.type)
    
    res.send({status: 'OK'})
})

app.get('/events', (req, res) => {
    res.send(events)
})


app.listen(4005, () => {
    console.log("V2")
    console.log("Listening on 4005")
})

