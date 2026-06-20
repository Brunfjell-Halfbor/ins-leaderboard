// src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Home
import HomePage from "../features/home/HomePage";

// Info
import ServersPage from "../features/info/ServersPage";
import AdminsPage from "../features/info/AdminsPage";
import BansPage from "../features/info/BansPage";
import DiscordPage from "../features/info/DiscordPage";
import HelpPage from "../features/info/HelpPage";
import RulesPage from "../features/info/RulesPage";
import CommandsPage from "../features/info/CommandsPage";
import TranslationsPage from "../features/info/TranslationsPage";
import PlayerSearchPage from "../features/info/PlayerSearchPage";

// Stats
import LeaderboardsPage from "../features/stats/LeaderboardsPage";
import MedicsPage from "../features/stats/MedicsPage";
import TeamKillPage from "../features/stats/TeamKillPage";
import BotsPage from "../features/stats/BotsPage";
import WeaponsPage from "../features/stats/WeaponsPage";

// Workshop
import CollectionPage from "../features/workshop/CollectionPage";
import MapsPage from "../features/workshop/MapsPage";

// Player
import PlayerProfilePage from "../features/player/PlayerProfilePage";

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="opacity-70 mt-2">
        Page not found
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Info */}
        <Route path="/servers" element={<ServersPage />} />
        <Route path="/admins" element={<AdminsPage />} />
        <Route path="/bans" element={<BansPage />} />
        <Route path="/discord" element={<DiscordPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/commands" element={<CommandsPage />} />
        <Route path="/translations" element={<TranslationsPage />} />
        <Route path="/player-search" element={<PlayerSearchPage />} />

        {/* Stats */}
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/medics" element={<MedicsPage />} />
        <Route path="/teamkills" element={<TeamKillPage />} />
        <Route path="/bots" element={<BotsPage />} />
        <Route path="/weapons" element={<WeaponsPage />} />

        {/* Workshop */}
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/maps" element={<MapsPage />} />

        {/* Player */}
        <Route path="/player/:steamId" element={<PlayerProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}