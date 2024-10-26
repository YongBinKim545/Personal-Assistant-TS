import { Knex } from 'knex';

export class DataBase {
    private _connection: Knex | null = null;
    private _interactionCount: number = 0;

    beginInteraction() {
        this._interactionCount++;
    }
    endInteraction() {
        this._interactionCount--;
        if (this._interactionCount === 0 && this._connection) {
            this.closeConnection();
        }
    }
    async openConnection() {
        if (this._connection) {
            console.log('Database connection already established.')
            return
        }
        try {
            this._connection = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: `${process.env.MY_DATA_PATH}/database.sqlite`,
                },
                useNullAsDefault: true,
                pool: {}
            })
            console.log('Database connection established successfully.')
        } catch (error) {
            console.error('Error opening database connection:', error)
        }
    }
    closeConnection() {
        if (this._connection) {
            this._connection.destroy();
            this._connection = null;
            console.log('Database connection closed.');
        }
    }
    get connection(): Knex | null {
        return this._connection;
    }
}