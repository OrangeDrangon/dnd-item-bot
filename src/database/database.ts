import connect, {
  sql,
  ConnectionOptions,
  ConnectionParams,
  ConnectionPool,
} from "@databases/pg";
import { Wallet, WalletEntry } from "../interfaces/wallet";

async function initializeDatabase(
  connectionPool: ConnectionPool
): Promise<void> {
  await connectionPool.query(sql`CREATE TABLE IF NOT EXISTS wallets (
    "id"            SERIAL PRIMARY KEY,
    "guildId"       VARCHAR(25) NOT NULL,
    "channelId"     VARCHAR(25) NOT NULL,
    "messageId"     VARCHAR(25) NOT NULL,
    "name"          VARCHAR(100) NOT NULL,
    "isDefault"     BOOLEAN NOT NULL,
    "platinum"      INT NOT NULL,
    "gold"          INT NOT NULL,
    "electrum"      INT NOT NULL,
    "silver"        INT NOT NULL,
    "copper"        INT NOT NULL
  );`);
  await connectionPool.query(
    sql`CREATE INDEX IF NOT EXISTS "guildIdIndex" ON wallets ("guildId");`
  );
  console.log("Database initizalized!");
}

export interface Database {
  rawQuery: (query: string) => Promise<unknown[]>;
  addWallet: (data: WalletEntry) => Promise<Wallet>;
  removeWallet: (filters: {
    name?: string | undefined;
    guildId?: string | undefined;
  }) => Promise<void>;
  getWallets: (filters: {
    name?: string | undefined;
    guildId: string;
  }) => Promise<Wallet[]>;
}

export async function createDatabase({
  connectionConfig,
  connectionOptions,
}: {
  connectionConfig?: string | ConnectionParams;
  connectionOptions?: ConnectionOptions;
}): Promise<Database> {
  const connectionPool = connect(connectionConfig, connectionOptions);

  await initializeDatabase(connectionPool);

  return {
    rawQuery: async (query: string): Promise<unknown[]> => {
      return await connectionPool.query(sql`${query}`);
    },
    addWallet: async ({
      guildId,
      channelId,
      messageId,
      name,
      isDefault,
    }: WalletEntry): Promise<Wallet> => {
      return (
        await connectionPool.query(
          sql`INSERT INTO wallets ("guildId", "channelId", "messageId", "name", "isDefault", "platinum", "gold", "electrum", "silver", "copper") VALUES (${guildId}, ${channelId}, ${messageId}, ${name}, ${isDefault}, 0, 0, 0, 0, 0) RETURNING *;`
        )
      )[0];
    },
    removeWallet: async ({
      name,
      guildId,
    }: {
      name?: string;
      guildId?: string;
    }): Promise<void> => {
      if (name != null && guildId == null) {
        throw new Error("If name is defined guildId must also be provided!");
      } else if (name != null && guildId != null) {
        await connectionPool.query(
          sql`DELETE FROM wallets WHERE "guildId" = ${guildId} AND "name" = ${name};`
        );
      } else if (name == null && guildId != null) {
        await connectionPool.query(
          sql`DELETE FROM wallets WHERE "guildId" = ${guildId};`
        );
      } else if (name == null && guildId == null) {
        throw new Error("No filter was provided!");
      }
    },
    getWallets: async ({
      name,
      guildId,
      isDefault,
    }: {
      name?: string;
      guildId: string;
      isDefault?: boolean;
    }): Promise<Wallet[]> => {
      const result: Wallet[] = await connectionPool.query(
        sql`SELECT * FROM wallets WHERE "guildId" = ${guildId}`
      );
      let filtered = result;
      if (name != null) {
        filtered = result.filter((e) => e.name === name);
      }
      if (isDefault != null) {
        filtered = result.filter((e) => e.isDefault === isDefault);
      }
      return filtered;
    },
  };
}
