const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const app = express();


// Connecting to a database
mongoose
    .connect(process.env.MONGO_DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })
    })
    .catch(err => console.log('[SERVER][ERROR]', err))
