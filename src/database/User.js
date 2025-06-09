import db from './database.js';
import { Model, DataTypes } from 'sequelize';

class User extends Model {
    static associate() {
        console.log('associate');
    }
}

User.init(
    {
        discordSnowflake: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        paranoid: true,
        sequelize: db,
        modelName: 'User',
    },
);

export default User;