export const APP_NAME = "TUG.GG";

export const NAVIGATION = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Info",
    children: [
      // { label: "Admins", path: "/admins" },
      // { label: "Bans", path: "/bans" },
      // { label: "Discord", path: "/discord" },
      { label: "Help", path: "/help" },
      { label: "Rules", path: "/rules" },
      // { label: "Game Commands", path: "/commands" },
      // { label: "Player Search", path: "/player-search" },
    ],
  },
  {
    label: "Stats",
    children: [
      { label: "Leaderboards", path: "/leaderboards" },
      { label: "Medics", path: "/medics" },
      { label: "TeamKill", path: "/teamkills" },
      { label: "Bots", path: "/bots" },
      { label: "Servers", path: "/servers" },
      // { label: "Weapons", path: "/weapons" },
    ],
  },
  // {
  //   label: "Workshop",
  //   children: [
  //     { label: "Collection", path: "/collection" },
  //     { label: "Maps", path: "/maps" },
  //   ],
  // },
];

export const API_DELAY = 500;