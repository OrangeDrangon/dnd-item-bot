

export interface Wallet {
  readonly id: number;
  guildId: string;
  channelId: string;
  messageId: string;
  name: string;
  isDefault: boolean;
  platinum: number;
  gold: number;
  electrum: number;
  silver: number;
  copper: number;
}

export interface WalletQuery {
  guildId: string;
  channelId?: string;
  messageId?: string;
  name?: string;
  isDefault?: boolean;
  platinum?: number;
  gold?: number;
  electrum?: number;
  silver?: number;
  copper?: number;
}

export type WalletEntry = Omit<
  Wallet,
  "id" | "platinum" | "gold" | "electrum" | "silver" | "copper"
>;

