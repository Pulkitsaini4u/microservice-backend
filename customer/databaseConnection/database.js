const Sequelize = require('sequelize');
const database = require('./initializeDatabase');
const models = require('./models/models-collections');
database.initializeDatabase();

const __databaseConnection = new Sequelize('customer','root','P@ssw0rd', { dialect: 'mysql', logging:false });

__databaseConnection.authenticate()
.then(()=>{
    console.log('connected');
})
.catch(err =>{
    console.log(err);
});

models.forEach( model => {
    __databaseConnection.define(model.modelName,model.modelColumns,model.modelOptions);
});

models.forEach((model,index)=>{
    if(model.associate && (typeof model.associate === 'function')){
        model.associate(__databaseConnection.models);
    }
});

__databaseConnection.sync({force:false})
.then(async ()=>{
    console.log('synced')
});

module.exports = __databaseConnection