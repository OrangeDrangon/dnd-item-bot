export interface Item {
  name: string;
  value: string;
  description: string;
}

export interface Channel {
  id: string;
  copper: number;
  items: Item[];
  currencyMessageId: string;
  itemsMessageId: string;
}

export interface Guild {
  id: string;
  channel: Channel;
}

export interface Db {
  guilds: Guild[];
}

export interface Database {
  addGuild: (guild: Guild) => Promise<void>;
  getGuild: (id: string) => Promise<Guild>;
  removeGuild: (id: string) => Promise<void>;
  updateCurrency: (id: string, value: number) => Promise<void>;
}
