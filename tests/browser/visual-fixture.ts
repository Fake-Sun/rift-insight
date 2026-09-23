import { profileFixture } from "./profile-fixture";

// Optional real artwork for manual visual review; interaction tests stay offline.
export function visualFixture() {
  const profile = structuredClone(profileFixture);
  const cdn = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img";
  const champions = ["AurelionSol", "Khazix", "Nunu", "MissFortune", "Renata"];
  const icon = (index: number) => `${cdn}/champion/${champions[index % 5]}.png`;
  const items = [3040, 3020, 3089, 4645, 3157, 3135, 3363].map((id) => ({
    id,
    icon: `${cdn}/item/${id}.png`,
  }));
  profile.profile.profileIcon = `${cdn}/profileicon/588.png`;
  profile.mastery.forEach((entry, index) => {
    entry.icon = icon(index);
  });
  profile.championStats.forEach((entry, index) => {
    entry.icon = icon(index);
  });
  profile.matches.forEach((match, index) => {
    match.championIcon = icon(index);
    match.items = items;
    match.spells = [
      { name: "Flash", icon: `${cdn}/spell/SummonerFlash.png` },
      { name: "Ignite", icon: `${cdn}/spell/SummonerDot.png` },
    ];
    match.participants.forEach((player, playerIndex) => {
      player.championIcon = icon(playerIndex);
      player.items = items;
    });
  });
  return profile;
}
