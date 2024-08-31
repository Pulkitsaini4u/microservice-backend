const Sequelize = require('sequelize');

const customer = {
    modelName: "customer",
    modelColumns: {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createdDateTimeUtc: {
            type: Sequelize.DATE(6),
            allowNull: false
        },
        lastUpdatedDateTimeUtc: {
            type: Sequelize.DATE(6),
            allowNull: false
        },
        deletedDateTimeUtc: {
            type: Sequelize.DATE(6)
        }
    },
    modelOptions: {
        tableName: "customer",
        freezeTableName: true,
        charset: 'latin1',
        timestamps: true,
        createdAt: 'createdDateTimeUtc',
        updatedAt: 'lastUpdatedDateTimeUtc',
        deletedAt: 'deletedDateTimeUtc',
        paranoid: true
    },
}
customer.associate = function associate(models) {
    models.customer.hasOne(models.contact, { as: 'customerContact', foreignKey: 'customerId' });
    models.customer.hasMany(models.address, { as: 'customerAddress', foreignKey: 'customerId' });
}
module.exports = customer;