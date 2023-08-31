// This is the backend for the website.
// Need to host it somewhere

import express from 'express';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true);
        },
        methods: ['GET', 'POST'],
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/createAccount', (req, res) => {
    console.log(req.body);
    res.send(JSON.stringify({ text: 'Creating account!' }));
    res.end();
});

app.listen(3000, () => {
    console.log('Listening on port 3000 uh!');
});
