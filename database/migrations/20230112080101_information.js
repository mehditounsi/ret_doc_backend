/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("log_retenue", (t) => {
        t.increments("id").primary();
        t.string("ip_client",100);
        t.string("mf_payeur", 20);
        t.string("mf_beneficiaire", 20);
        t.json("body");
        t.enu("action", ['print', 'share'])
        t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("log_retenue")
};
