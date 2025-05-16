export function up(knex) {
    return knex.schema.table('link', table => {
        table.string('topics', 255);
        table.string('updated', 255);
      })
};

export function down(knex) {
    return knex.schema.table('link', table => {
        table.dropColumn('topics');
        table.dropColumn('updated');
      })
};
