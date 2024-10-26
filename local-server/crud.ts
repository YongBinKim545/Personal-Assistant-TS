import { DataBase } from './database/connectionManager'

const db = new DataBase()
export const readAllData = async (tableNames: string[]): Promise<Record<string, any[]>> => {
    db.beginInteraction()
    db.openConnection()
    const promises = tableNames.map((tableName) => db.connection(tableName));
    const resolved = await Promise.all(promises);
    const response: Record<string, any[]> = {};
    tableNames.forEach((tableName, index) => {
        response[tableName] = resolved[index]
    });
    db.endInteraction()
    return response
}

export const readData = async (tableName: string, query: QueryT): Promise<TableContentT[]> => {
    db.beginInteraction()
    db.openConnection()
    const { field, condition, value } = query
    const response = await db.connection(tableName).where(field, condition, value)
    db.endInteraction()
    return response
}

export const createData = async (tableName: string, payload: TableContentT[]) => {
    db.beginInteraction()
    db.openConnection()
    const response = await db.connection(tableName).insert(payload)
    db.endInteraction()
    return response
}

export const patchData = async (tableName:string, query:QueryT, payload:TableContentT) => {
    db.beginInteraction()
    db.openConnection()
    const { field, condition, value } = query
    const response = await db.connection(tableName).where(field, condition, value).update(payload) //updated rows count
    db.endInteraction()
    return response
}

export const deleteData = async (tableNames: string[], query: QueryT[]) => {
    db.beginInteraction()
    db.openConnection()
    const promises = tableNames.map((tableName, index) =>
        db.connection(tableName).where(query[index].field, query[index].condition, query[index].value).delete()
    );
    const resolved = await Promise.all(promises);
    const deletedCount = resolved.reduce((accumulator, current) => accumulator + current, 0);
    db.endInteraction()
    return deletedCount
}