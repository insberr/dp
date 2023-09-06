// This is the backend for the website.
// Need to host it somewhere

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import json5 from 'json5';
import crypto from 'crypto';

type User = {
    username: string;
    passwordSalt: string;
    passwordHash: string;
    icsFile: string;
};
type Db = {
    users: User[];
};
function db(): Db {
    return json5.parse(fs.readFileSync('/home/opc/dp/src/backend/db/temp.db.json5').toString());
}

function dbsave(data: any) {
    fs.writeFileSync('/home/opc/dp/src/backend/db/temp.db.json5', json5.stringify(data, null, 2));
}

const app = express();
const devMode = false;
const allowedOrigins = ['https://dpdragons.insberr.com', 'https://backend.dpd.insberr.com'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (origin === undefined) return callback(null, true);
            if (devMode || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('Origin not allowed: ' + origin));
        },
    })
);
app.use(express.json());

app.get('/', (req, res) => {
    console.log('GET on / Thier ip is: ', req.ip);
    res.send('<a>Hello World!</a>');
});

// admin page /admin?password=1234
app.get('/admin', (req, res) => {
    console.log('GET on /admin Thier ip is: ', req.ip);
    if (req.query.password === undefined) return res.send('<div>Admin Page</div>');
    if (req.query.password === '1234') {
        res.send(fs.readFileSync('/home/opc/dp/src/backend/src/admin.html').toString());
    } else {
        res.send('<div>Nice Try LMAO</div>');
    }
});

app.post('/createAccount', (req, res) => {
    const reqBody = req.body;

    if (reqBody.username === '') {
        return res.send({ data: 'username is blank' });
    }
    if (reqBody.password === '') {
        return res.send({ data: 'password is blank' });
    }

    const temp_db = db();

    const doesUserExist = temp_db.users.find((user) => {
        return user.username === reqBody.username;
    });

    if (doesUserExist !== undefined) {
        return res.send({ data: 'user allready exists' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(reqBody.password, salt, 1000, 64, `sha512`).toString(`hex`);

    temp_db.users.push({ username: reqBody.username, passwordSalt: salt, passwordHash: hash, icsFile: reqBody.icsFile });

    // Very temporary
    dbsave(temp_db);

    res.send({ data: 'user created successfully' });
});

app.post('/login', (req, res) => {
    const reqBody = req.body;

    if (reqBody.username === '') {
        return res.send({ data: 'username is blank' });
    }
    if (reqBody.password === '') {
        return res.send({ data: 'password is blank' });
    }

    const temp_db = db();

    const doesUserExist = temp_db.users.find((user) => {
        return user.username === reqBody.username;
    });

    if (doesUserExist === undefined) {
        return res.send({ error: 'user does not exist' });
    }

    const hash = crypto.pbkdf2Sync(reqBody.password, doesUserExist.passwordSalt, 1000, 64, `sha512`).toString(`hex`);
    if (hash !== doesUserExist.passwordHash) {
        return res.send({ error: 'incorrect password' });
    }

    res.send(doesUserExist);
});

var privateKey = fs.readFileSync('/etc/letsencrypt/live/backend.dpd.insberr.com/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/backend.dpd.insberr.com/fullchain.pem');

https
    .createServer(
        {
            key: privateKey,
            cert: certificate,
        },
        app
    )
    .listen(443);

console.log('Listening on port 443!');
