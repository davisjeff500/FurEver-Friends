const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Dog extends Model {}

Dog.init(
{
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    },
    name: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    description: {
    type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    size: {
        type: DataType.STRING,
    },
    kidFriendly: {
        type: DataType.BOOLEAN,
    },
    user_id: {
    type: DataTypes.INTEGER,
    references: {
        model: 'user',
        key: 'id',
    },
    },
},
{
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'dog',
}
);

module.exports = Dog;