const Sequelize = require('sequelize');
const order = {
    modelName: "order",
    modelColumns: {
        id: {
            type: Sequelize.STRING,
            autoIncrement: false,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        productId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        customerId: {
            type: Sequelize.STRING,
            allowNull: false
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
        tableName: "order",
        freezeTableName: true,
        charset: 'latin1',
        timestamps: true,
        createdAt: 'createdDateTimeUtc',
        updatedAt: 'lastUpdatedDateTimeUtc',
        deletedAt: 'deletedDateTimeUtc',
        paranoid: true
    },
};

order.associate = function associate(models) {}

module.exports = order;