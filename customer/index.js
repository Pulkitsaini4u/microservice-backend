const express = require('express');
global.databaseConnection = require('./databaseConnection/database');
const bodyParser = require('body-parser');
const routes = require('./routes');
const StartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use('/api', routes);
    app.listen(1001, () => {
        console.log(`listening to port 1001`);
    })
}
StartServer();