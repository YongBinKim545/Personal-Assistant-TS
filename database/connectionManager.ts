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
    async openConnection(dbPath: string) {
        if (this._connection) {
            console.log('Database connection already established.')
            return
        }
        try {
            this._connection = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: dbPath,
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