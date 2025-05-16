export async function up(knex) {
    await knex.schema.createTable("user", (table) => {
        table.increments("id").primary();
        table.string("external_id", 256);
        table.string("name", 64).notNullable();
        table.string("email", 255);
    });
};

export async function down(knex) {
    await knex.schema.dropTable("user");
};
