const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    console.log("Event Received:", type);
  
    if (type === 'PostCreated') {

        const { id, title } = data;

        posts[id] = {
            id, title, comments: []
        };

    }

    if (type === 'CommentCreated') {

        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({
            id, content, status
        });

    }

    if (type === 'CommentUpdated') {

        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id === id);

        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
})

app.listen(4002, async () => {
    console.log('listening on 4002');

    const res = await axios.get('http://events-bus-srv:4005/events').catch(e => console.log(e.message));

    console.log(res);

    for (let event of res?.data) {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data);
    }
});
