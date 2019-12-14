export function getCurrencyName(
  variation: string
): "platinum" | "gold" | "electrum" | "silver" | "copper" {
  switch (variation.toLowerCase()) {
    case "p":
      return "platinum";
    case "platinum":
      return "platinum";
    case "g":
      return "gold";
    case "gold":
      return "gold";
    case "e":
      return "electrum";
    case "electrum":
      return "electrum";
    case "s":
      return "silver";
    case "silver":
      return "silver";
    case "c":
      return "copper";
    case "copper":
      return "copper";
    default:
      throw new Error("A valid currency was not provided.");
  }
}
