import connect, {
  sql,
  ConnectionOptions,
  ConnectionParams,
  ConnectionPool,
} from "@databases/pg";
import { Wallet, WalletEntry, WalletQuery } from "./interfaces/wallet";
import { generateAndQuery, generateCommaQuery } from "./utils/generateQuery";
import { logger } from "./utils/logger";
import { sleep } from "./utils/sleep";

async function initializeDatabase(
  connectionPool: ConnectionPool
): Promise<boolean> {
  logger.info("Initializing database");
  try {
    logger.info("Creating wallets channel if it does not exisit.");
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
    logger.info("Successfully created wallets table.");
    logger.info("Creating guildId index for faster searches.");
    await connectionPool.query(
      sql`CREATE INDEX IF NOT EXISTS "guildIdIndex" ON wallets ("guildId");`
    );
    logger.info("Successfully created guildId index.");
    return true;
  } catch (error) {
    logger.error("Error initializing database" + error != null ? error : "");
    return false;
  }
}

export interface Database {
  rawQuery: (query: string) => Promise<unknown[]>;
  addWallet: (data: WalletEntry) => Promise<Wallet>;
  removeWallet: (queryParams: WalletQuery) => Promise<void>;
  getWallets: (queryParams: WalletQuery) => Promise<Wallet[]>;
  updateWallet: (wallet: Wallet) => Promise<Wallet>;
}

export async function createDatabase({
  connectionConfig,
  connectionOptions,
}: {
  connectionConfig?: string | ConnectionParams;
  connectionOptions?: ConnectionOptions;
}): Promise<Database> {
  const connectionPool = connect(connectionConfig, connectionOptions);

  let timeout = 1000;
  while (!(await initializeDatabase(connectionPool))) {
    logger.info(`Retrying in ${timeout / 1000} seconds.`);
    await sleep(timeout);
    timeout = timeout < 60000 ? timeout * 2 : timeout;
  }

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
    removeWallet: async (queryParams: WalletQuery): Promise<void> => {
      const query = sql`DELETE FROM wallets WHERE ${generateAndQuery(
        queryParams
      )};`;
      await connectionPool.query(query);
    },
    getWallets: async (queryParams: WalletQuery): Promise<Wallet[]> => {
      const query = sql`SELECT * FROM wallets WHERE ${generateAndQuery(
        queryParams
      )};`;
      return (await connectionPool.query(query)) as Wallet[];
    },
    updateWallet: async ({ id, ...queryParams }: Wallet): Promise<Wallet> => {
      const query = sql`UPDATE wallets SET ${generateCommaQuery(
        queryParams
      )} WHERE ${generateAndQuery({
        id,
      })} RETURNING *;`;
      return (await connectionPool.query(query))[0];
    },
  };
}
