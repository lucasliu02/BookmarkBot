import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    // logging: console.info, // TODO: disable logging?
});

export default sequelize;

const folders = [
    { name: 'folder1', value: 'folder1' },
    { name: 'folder2', value: 'folder2' },
    { name: 'folder3', value: 'folder3' },
];

export function getFolders() {
    return folders;
}
