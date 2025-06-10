import db from '../database.js';
import { Model, DataTypes } from 'sequelize';

export class User extends Model {
    static associate() {
        //
    }
}

User.init(
    {
        discordSnowflake: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },
    },
    {
        paranoid: true,
        sequelize: db,
        modelName: 'User',
    },
);
