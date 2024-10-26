import { Knex } from 'knex';
const defaultModels = [
    { provider: 'OpenAI', name: 'gpt-4o', task: 'Text Generation' },
    { provider: 'OpenAI', name: 'gpt-4o-mini', task: 'Text Generation' },
    { provider: 'OpenAI', name: 'gpt-4-turbo', task: 'Text Generation' },
    { provider: 'Google', name: 'gemini-1.5-flash', task: 'Text Generation' },
    { provider: 'Google', name: 'gemini-1.5-pro', task: 'Text Generation' },
    { provider: 'Google', name: 'gemini-1.0-pro', task: 'Text Generation' },
    { provider: 'Google', name: 'aqa', task: 'Text Generation' },
    { provider: 'Anthropic', name: 'claude-3-5-sonnet-20240620', task: 'Text Generation' },
    { provider: 'Anthropic', name: 'claude-3-opus-20240229', task: 'Text Generation' },
    { provider: 'Anthropic', name: 'claude-3-sonnet-20240229', task: 'Text Generation' },
    { provider: 'Anthropic', name: 'claude-3-haiku-20240307', task: 'Text Generation' },
]

const defaultModes = [
    { name: 'Chat(Basic)', category:'chat', description: 'Using a language model without any specific references.', prompt: 'You are a helpful assistant' },
    { name: 'Chat(Advanced)', category:'chat', description: 'Using a language model incorporating information from an internet search.', prompt: 'You are a helpful assistant'},
    // { name: 'Chat(Advanced)', category:'chat', description: 'Using a multi-modal model, incorporating information from an internet search.', prompt: 'You are a helpful assistant'},
    { name: 'Q&A(Basic)', category:'qa', description: 'Answering questions using specific references from provided sources, such as local documents or web pages, focusing on simple text data.', prompt: 'You are a helpful assistant' },
    // { name: 'Q&A(Advanced)', category:'qa', description: 'Answering questions using a multi-modal model, referencing text, images, and table data from provided sources like local documents or web pages.', prompt: 'You are a helpful assistant' },
]

const createConnectionTable = (knex: Knex) =>
    knex.schema.createTable("connection", (table) => {
        table.increments("id").primary();
        table.string("provider").notNullable();
        table.string("value");
    }).then(() => {
        return knex("connection").insert([
            { provider: 'data_file_path', value: process.env.MY_DATA_PATH },
            { provider: 'Local', value: "http://localhost:11434" },
            { provider: 'OpenAI' },
            { provider: 'Google' },
            { provider: 'Anthropic' },
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
        table.text("thread_id").notNullable().unique();
        table.integer("model_id").unsigned().notNullable();
        table.integer("mode_id").unsigned().notNullable();
        table.integer("dataset_id");
        table.integer("url_id");
    });

const createChatModeTable = (knex: Knex) =>
    knex.schema.createTable("chat_mode", (table) => {
        table.increments("id").primary();
        table.text("name").notNullable();
        table.text("category").notNullable();
        table.text("description").notNullable();
        table.text("prompt");
        table.float("temperature");
        table.float("max_tokens");
        table.float("top_probability");
        table.float("frequency_penalty")
        table.float("presence_penalty");
        table.float("stop");
    }).then(() => {
        return knex("chat_mode").insert(defaultModes);
    })
const createChatContentTable = (knex: Knex) =>
    knex.schema.createTable("chat_contents", (table) => {
        table.increments("id").primary();
        table.string("role").notNullable();
        table.binary("content").notNullable();
        table.integer("title_id").unsigned().notNullable();
    });
const createURLTable = (knex: Knex) =>
    knex.schema.createTable("urls", (table) => {
        table.increments("id").primary();
        table.string("url").notNullable();
        table.integer("title_id").unsigned().notNullable();
    });
const createModelTable = (knex: Knex) =>
    knex.schema.createTable("models", (table) => {
        table.increments("id").primary();
        table.string("provider").notNullable();
        table.string("name").notNullable().unique();
        table.string("task");
    }).then(() => {
        return knex("models").insert(defaultModels);
    });

const createActiveItemTable = (knex: Knex) =>
    knex.schema.createTable("active_item", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable().unique();
        table.integer("active_item_id");
    }).then(() => {
        return knex("active_item").insert([
            { name: 'dataset' },
            { name: 'model' },
            { name: 'mode', active_item_id: 1 },
        ]);
    });

export const createTables = async (knex: Knex) => {
    try {
        await Promise.all([
            createDatasetTable(knex),
            createChatTitleTable(knex),
            createChatModeTable(knex),
            createConnectionTable(knex),
            createDataTable(knex),
            createChatContentTable(knex),
            createURLTable(knex),
            createModelTable(knex),
            createActiveItemTable(knex),
        ])
        return 'success';
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};