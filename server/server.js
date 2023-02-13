// to use import x from 'x' instead of const x = require('x')....
// we need to write type="module" in package.json

import express from 'express';
import morgan from 'morgan';   // used to log requests to the console (express4)
import cors from 'cors';
import connect from './database/conn.js';

const app = express();


// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');   //less hacker know about our stack


const port = 8000;

// HTTP GET request
app.get('/', (req, res) =>{
    res.status(201).json("Home GET Request");
});


// start server only when we have valid connection
connect().then(() => {
    try {
        app.listen(port,() =>{
            console.log(`Server connected to https://localhost:${port}`);
        
        })
    }
    catch (error) {
        console.log('Cannot connect to the server');
    }
}).catch(error => {
    console.log("Invalid database connection");

})
