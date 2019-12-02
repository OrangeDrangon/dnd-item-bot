import connect, {
  sql,
  ConnectionOptions,
  ConnectionParams,
  ConnectionPool,
} from "@databases/pg";
import { Wallet, WalletEntry, WalletQuery } from "../interfaces/wallet";
import { generateQuery } from "../util/generateQuery";

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
    removeWallet: async (queryParams: WalletQuery): Promise<void> => {
      let query = generateQuery(
        "DELETE FROM wallets WHERE",
        queryParams,
        "AND"
      );
      await connectionPool.query(query);
    },
    getWallets: async (queryParams: WalletQuery): Promise<Wallet[]> => {
      let query = generateQuery(
        "SELECT * FROM wallets WHERE",
        queryParams,
        "AND"
      );
      return (await connectionPool.query(query)) as Wallet[];
    },
    updateWallet: async (wallet: Wallet): Promise<Wallet> => {
      let query = sql`${generateQuery(
        sql`UPDATE wallets SET ${generateQuery("", wallet, ", ")} WHERE`,
        { id: wallet.id, guildId: wallet.guildId },
        "AND",
        "RETURNING *"
      )}`;
      return (await connectionPool.query(query))[0];
    },
  };
}
