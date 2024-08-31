const Sequelize = require('sequelize');
const address = {
    modelName: "address",
    modelColumns: {
        id: {
            type: Sequelize.STRING,
            autoIncrement: false,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true,
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
        tableName: "address",
        freezeTableName: true,
        charset: 'latin1',
        timestamps: true,
        createdAt: 'createdDateTimeUtc',
        updatedAt: 'lastUpdatedDateTimeUtc',
        deletedAt: 'deletedDateTimeUtc',
        paranoid: true
    },
};

address.associate = function associate(models) {
}

module.exports = address;
