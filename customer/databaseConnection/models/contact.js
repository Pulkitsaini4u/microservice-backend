const Sequelize = require('sequelize');
const contact = {
    modelName: "contact",
    modelColumns: {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
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
        tableName: "contact",
        freezeTableName: true,
        charset: 'latin1',
        timestamps: true,
        createdAt: 'createdDateTimeUtc',
        updatedAt: 'lastUpdatedDateTimeUtc',
        deletedAt: 'deletedDateTimeUtc',
        paranoid: true
    }
}
contact.associate = function associate(models) {
}
module.exports = contact;
