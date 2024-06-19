import { createTables } from './schema';
import { DataBase } from './connectionManager'
import path from 'path'
import * as fs from 'fs/promises';

export const initializeDatabase = async (dbPath: string) => {
  const db = new DataBase()
  try {
    await fs.access(dbPath, fs.constants.F_OK);
    await db.openConnection(dbPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Database file is not existing!! Creating new database file...');
      const dirPath = path.dirname(dbPath)
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(dbPath, '');
      console.log('Database file has created');
      await db.openConnection(dbPath)
      console.log('Database open')
    } else {
      console.error('Unexpected error during file access:', err);
      throw err; // Re-throw the error for further handling
    }
  }
  try {
    const exists = await db.connection.schema.hasTable('user_config')
    if (!exists) {
      const response = await createTables(db.connection)
      console.log('Default Table has been created', response)
    }

  } catch (err) {
    console.error('Error initializing Knex:', err);
    throw err; // Re-throw the error for further handling in main.ts
  } finally {
    db.closeConnection()
  }
}