const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.log("Event Received:", req.body.type);
  
    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
    
        await axios.post('http://events-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                ...data,
                status,
            }
        }).catch(err => {
            console.log(err.message);
        })
    }

    res.send()
});

app.listen(4003, () => {
    console.log('Listening on 4003')
});