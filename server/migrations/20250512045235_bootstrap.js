export async function up(knex) {
    await knex.schema.createTable("link", (table) => {
        table.increments("id").primary();
        table.string("external_id", 256);
        table.integer("level");
        table.string("name", 64).notNullable();
        table.string("description", 255);
        table.string("origin_url", 255);
        table.integer("subscribers_count").default(0);
        table.integer("watchers_count").default(0);
    });
};

export async function down(knex) {
    await knex.schema.dropTable("link");
};
