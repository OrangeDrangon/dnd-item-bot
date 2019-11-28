export interface IItem {
  name: string;
  value: string;
  description: string;
}

export interface IChannel {
  id: string;
  copper: number;
  items: IItem[];
  currencyMessageId: string;
  itemsMessageId: string;
}

export interface IGuild {
  id: string;
  channel: IChannel;
}

export interface IDb {
  guilds: IGuild[];
}

export type Database = {
  addGuild: (guild: IGuild) => Promise<void>;
  getGuild: (id: string) => Promise<IGuild>;
  removeGuild: (id: string) => Promise<void>;
  updateCurrency: (id: string, value: number) => Promise<void>
};
