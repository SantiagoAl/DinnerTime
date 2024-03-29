const express = require('express');
// This allows us to acess something outside of our server from our server
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
    origin: 'https://fierce-everglades-81330.herokuapp.com',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200
}

// MiddleWare
app.use(cors(corsOptions));
app.use(express.json()); // Allows us to parse JSON

// Setup connection to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// Establish connection to the MongoDB database
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Import the files into these variables
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');

// Use these files
app.use('/events', eventRouter);
app.use('/users', userRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production')
{
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// This will start the server on a certain port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
