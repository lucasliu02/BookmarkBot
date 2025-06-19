import db from '../database.js';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';

export class Bookmark extends Model {
    static associate(models) {
        // this.belongsTo(models.Folder), {
        //     foreignKey: 'folder',
        // };
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
        messageId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        link: {
            type: DataTypes.STRING,
            // unique: true,
            // primaryKey: true,
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
        },
    },
    {
        // paranoid: true,
        sequelize: db,
        modelName: 'Bookmark',
    },
);
