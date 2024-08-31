const express = require('express');
global.databaseConnection = require('./databaseConnection/database');
const bodyParser = require('body-parser');
const routes = require('./orderRoutes.js');
const StartServer = async () => {
    try {
        const app = express();
        app.use(bodyParser.json());
        app.use('/api', routes);
        app.listen(1003, () => {
            console.log(`listening to port 1003`);
        })
    } catch (error) {
        console.log(error);
    }
}
StartServer();