const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const Path = require('path');
const connectDB = require('./config/db');

const machines = require('./routes/machines');
const auth = require('./routes/auth');
const designs = require('./routes/designs');
const parts = require('./routes/parts');

dotenv.config({ path: './config/config.env' });

connectDB();

let app = express();

app.use(express.json());
app.use(cors());
app.use('/public', express.static(Path.join(Path.dirname(__dirname), 'scm_service_2/public'))); // for public access, refer to this directory
app.use('/api/v1/machines', machines);
app.use('/api/v1/user', auth);
app.use('/api/v1/designs', designs);
app.use('/api/v1/parts', parts);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
})