import { Knex } from 'knex';

const createUserConfigTable = (knex: Knex) =>
    knex.schema.createTable("user_config", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("value");
    }).then(() => {
        return knex("user_config").insert([
            { name: "default_mode" },
            { name: "default_model" },
            { name: "openai_apikey" },
            { name: "gemini_apikey" },
        ]);
    });

const createDatasetTable = (knex: Knex) =>
    knex.schema.createTable("datasets", (table) => {
        table.increments("id").primary();
        table.string("name").unique().notNullable();
        table.string("embedding_model");
        table.string("vector_file_path").unique();
    });

const createDataTable = (knex: Knex) =>
    knex.schema.createTable("dataset_detail", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("path");
        table.integer("dataset_id").unsigned().notNullable();
    });

const createChatTitleTable = (knex: Knex) =>
    knex.schema.createTable("chat_titles", (table) => {
        table.increments("id").primary();
        table.text("title").notNullable();
        table.text("code").notNullable().unique();
        table.string("mode");
        table.string("model");
        table.integer("dataset_id");
    });

const createChatContentTable = (knex: Knex) =>
    knex.schema.createTable("chat_contents", (table) => {
        table.increments("id").primary();
        table.string("role").notNullable();
        table.binary("content").notNullable();
        table.integer("title_id").unsigned().notNullable();
    });

const createActiveItemTable = (knex: Knex) =>
    knex.schema.createTable("active_item", (table) => {
        table.increments("id").primary();
        table.integer("dataset_id").notNullable();
        table.integer("llm_id").notNullable();
    }).then(() => {
        return knex("active_item").insert([
            { dataset_id: 1, llm_id: 1 },
        ]);
    });

export const createTables = async (knex: Knex) => {
    try {
        await Promise.all([
            createDatasetTable(knex),
            createChatTitleTable(knex),
            createUserConfigTable(knex),
            createDataTable(knex),
            createChatContentTable(knex),
            createActiveItemTable(knex)
        ])
        return 'success';
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};