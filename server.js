const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');


dotenv.config();


const app = express();

// Routes export
const usersRoutes = require('./routes/users-route');

// Functions
// morgan(function (tokens, req, res) {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms'
//     ].join(' ')
// })

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))

app.use('/api/users', usersRoutes)

// Connecting to a database
mongoose
    .connect(process.env.MONGO_DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })
    })
    .catch(err => console.log('[SERVER][ERROR]', err))
