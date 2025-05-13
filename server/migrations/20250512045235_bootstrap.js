export async function up(knex) {
    await knex.schema.createTable("link", (table) => {
        table.increments("id").primary();
        table.uuid("external_id");
        table.integer("level");
        table.string("name", 64).notNullable();
        table.string("description", 255);
        table.string("href", 255);
    });
};

export async function down(knex) {
    await knex.schema.dropTable("link");
};
