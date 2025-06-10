import db from '../database.js';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { Folder } from './Folder.js';

export class Bookmark extends Model {
    static associate() {
        //
    }
}

Bookmark.init(
    {
        discordSnowflake: {
            type: DataTypes.STRING,
            references: {
                model: User,
                key: 'discordSnowflake',
            },
            primaryKey: true,
        },
        link: {
            type: DataTypes.STRING,
            // unique: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        // should reference folder but sequelize doesn't support compound foreign keys?
        folder: {
            type: DataTypes.STRING,
            // type: DataTypes.INTEGER,
            // references: {
            //     model: Folder,
            //     key: 'id',
            // },
            allowNull: true,
        },
    },
    {
        // paranoid: true,
        sequelize: db,
        modelName: 'Bookmark',
    },
);
