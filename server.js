const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

const app = express();

// Body Parser
app.use(express.json());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');

const exp = require('constants');

// FIle Uploader
app.use(fileupload());

// Cookie parser
app.use(cookieParser());

// Make static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Node Server started`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
