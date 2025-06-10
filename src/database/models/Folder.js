import db from '../database.js';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';

export class Folder extends Model {
    static associate() {
        //
    }
}

Folder.init(
    {
        discordSnowflake: {
            type: DataTypes.STRING,
            references: {
                model: User,
                key: 'discordSnowflake',
            },
            primaryKey: true,
        },
        folder: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    {
        sequelize: db,
        modelName: 'Folder',
    },
);