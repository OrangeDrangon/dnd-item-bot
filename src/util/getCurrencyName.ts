export function getCurrencyName(variation: string) {
  switch (variation) {
    case "platinum" || "p":
      return "platinum";
    case "gold" || "g":
      return "gold";
    case "electrum" || "e":
      return "electrum";
    case "silver" || "s":
      return "silver";
    case "copper" || "c":
      return "copper";
    default:
      throw new Error("A valid currency was not provided.");
  }
}
