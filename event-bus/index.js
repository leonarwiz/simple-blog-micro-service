import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.post('/events', (req, res) => {
    const event = req.body

    axios.post('http://localhost:4000/events', event)
        .catch((err) => {
            console.error(err)
        })
    axios.post('http://localhost:4001/events', event)
        .catch((err) => {
            console.error(err)
        })
    axios.post('http://localhost:4002/events', event)
        .catch((err) => {
            console.error(err)
        })
    res.send({status: 'OK'})

})


app.listen(4005, () => {
    console.log("Listening on 4005")
})
