// This is the backend for the website.
// Need to host it somewhere

import express from 'express';
import cookieParser from 'cookie-parser';
import sessions, { SessionData } from 'express-session';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import json5 from 'json5';
import crypto from 'crypto';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

type UserID = string;
type User = {
    // timestamp-version-uh
    userId: UserID;
    dateCreated: Date;
    username: string;
    passwordSalt: string;
    passwordHash: string;
    icsFile?: string | null;
    files: {
        ics: string | null;
    };
    friends: UserID[];
};

type UserV2 = User & {
    session: (sessions.Session & Partial<sessions.SessionData>) | null;
};

type Db = {
    users: UserV2[];
};
function db(): Db {
    return json5.parse(fs.readFileSync('/home/opc/dp/src/backend/db/temp.db.json5').toString());
}

function dbsave(data: any) {
    fs.writeFileSync('/home/opc/dp/src/backend/db/temp.db.json5', json5.stringify(data, null, 2));
}

function dbBackup() {
    fs.writeFileSync('/home/opc/dp/src/backend/db/temp.backup.db.json5', json5.stringify(db(), null, 2));
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

app.use(
    sessions({
        secret: process.env.SESSION_SECRET as string,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log('GET on / Thier ip is: ', req.ip);
    res.send('<a>Hello World!</a>');
});

app.get('/admin', (req, res) => {
    console.log('GET on /admin Thier ip is: ', req.ip);
    if (req.query.password === undefined) return res.send('<div>Admin Page</div>');
    if (req.query.password === process.env.ADMIN_PASSWORD) {
        const html = fs.readFileSync('/home/opc/dp/src/backend/src/admin.html').toString();
        const parsedHtml = html.replace('{db}', json5.stringify(db()));
        res.send(parsedHtml);
    } else {
        res.send('<div>Nice Try LMAO</div>');
    }
});

app.post('/createAccount', async (req, res) => {
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
    const newUserId = v4();

    req.sessionID = newUserId;
    temp_db.users.push({
        userId: newUserId,
        dateCreated: new Date(),
        username: reqBody.username,
        passwordSalt: salt,
        passwordHash: hash,
        files: { ics: reqBody.icsFile },
        friends: [],
        session: req.session, // ! temporary
    });

    // Very temporary
    dbsave(temp_db);

    res.send({ data: 'user created successfully' });
});

app.post('/login', (req, res, next) => {
    const reqBody = req.body;
    const reqSession = req.session;

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

    req.session.regenerate(function (err) {
        if (err) next(err);

        // store user information in session, typically a user id
        // @ts-ignore
        req.session.user = doesUserExist.userId;

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
            if (err) return next(err);
            res.send(doesUserExist);
        });
    });

    // res.send(doesUserExist);
});

// Idea
app.post('/user/add_friend', (req, res) => {
    const reqSession = req.session;
    const reqBody = req.body;
    console.log(req.sessionID, req.session.id);

    const user = db().users.find((u) => {
        return u.session?.id === req.sessionID;
    });
    if (user === undefined) return res.send({ error: 'user not found for given session id... hmm' });

    res.send({ data: 'not implemented' });
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

// function migrateUsersToHaveSession() {
//     const _temp_db = db();
//     dbBackup();
//     const modified_users = _temp_db.users.map((user) => {
//         const updatedUser: UserV2 = {
//             ...user,
//             userId: v4(),
//             session: null,
//         };
//         return updatedUser;
//     });
//     _temp_db.users = modified_users;
//     fs.writeFileSync('/home/opc/dp/src/backend/db/temp.new-next.db.json5', json5.stringify(_temp_db, null, 2));
// }

// migrateUsersToHaveSession();
