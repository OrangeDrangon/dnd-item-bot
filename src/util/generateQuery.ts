import { sql, SQLQuery } from "@databases/pg";

export function generateQuery(
  base: string | SQLQuery,
  filter: { [key: string]: unknown },
  seperator: string | SQLQuery,
  ending?: string | SQLQuery
): SQLQuery {
  return sql`${base} ${sql.join(
    Object.keys(filter).map((key) => sql`"${key}" = ${filter[key]}`),
    sql` ${seperator} `
  )} ${ending};`;
}
