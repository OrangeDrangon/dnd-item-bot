import { sql, SQLQuery } from "@databases/pg";

export function generateQuery(
  base: string | SQLQuery,
  filter: { [key: string]: any },
  seperator: string | SQLQuery,
  ending?: string | SQLQuery,
) {
  return sql`${base} ${sql.join(
    Object.keys(filter).map((key) => sql`"${key}" = ${(filter as any)[key]}`),
    sql` ${seperator} `
  )} ${ending};`;
}
