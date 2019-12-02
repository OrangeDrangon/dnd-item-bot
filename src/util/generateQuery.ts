import { sql, SQLQuery } from "@databases/pg";

export function generateAndQuery(filter: { [key: string]: any }): SQLQuery {
  return sql`${sql.join(
    Object.keys(filter).map((key) => sql`(${sql.ident(key)} = ${filter[key]})`),
    sql` AND `
  )}`;
}

export function generateCommaQuery(filter: { [key: string]: any }): SQLQuery {
  return sql`${sql.join(
    Object.keys(filter).map((key) => sql`(${sql.ident(key)} = ${filter[key]})`),
    sql`, `
  )}`;
}
