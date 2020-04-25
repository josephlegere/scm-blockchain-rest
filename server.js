const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const machines = require('./routes/machines');
const auth = require('./routes/auth');

dotenv.config({ path: './config/config.env' });

connectDB();

let app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // for public access, refer to this directory
app.use('/api/v1/machines', machines);
app.use('/api/v1/user', auth);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
})