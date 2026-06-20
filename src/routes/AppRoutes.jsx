import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Placeholder({ title }) {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        {title}
      </h1>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Placeholder title="Home" />}
        />

        <Route
          path="/leaderboards"
          element={<Placeholder title="Leaderboards" />}
        />

        <Route
          path="/servers"
          element={<Placeholder title="Servers" />}
        />

        <Route
          path="/player-search"
          element={<Placeholder title="Player Search" />}
        />

        <Route
          path="*"
          element={<Placeholder title="404" />}
        />
      </Route>
    </Routes>
  );
}